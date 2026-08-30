// Möngö Firebase runtime compatibility driver.
// Preserves the existing Firestore path contract discovered in the verified phone runtime.
(function(global){
'use strict';

function assertRuntime(runtime){
  const r=runtime||{};
  const missing=[];
  if(!r.db || typeof r.db.collection!=='function') missing.push('db.collection');
  if(!r.firebase || !r.firebase.firestore || !r.firebase.firestore.FieldValue || typeof r.firebase.firestore.FieldValue.serverTimestamp!=='function') missing.push('firebase.firestore.FieldValue.serverTimestamp');
  return {valid:missing.length===0,missing};
}

function refs(db,uid){
  if(!uid) throw new Error('uid required');
  const root=db.collection('users').doc(uid);
  return Object.freeze({
    root,
    appState:root.collection('appState').doc('main'),
    financial:root.collection('financial').doc('main'),
    settings:root.collection('settings').doc('main'),
    profile:root.collection('profile').doc('main')
  });
}

function snapshotData(snap){ return snap&&snap.exists&&typeof snap.data==='function'?snap.data():null; }

function createRuntimeDriver(runtime,options){
  const check=assertRuntime(runtime);
  if(!check.valid) throw new Error('Invalid Firebase runtime: missing '+check.missing.join(', '));
  const db=runtime.db;
  const serverTimestamp=()=>runtime.firebase.firestore.FieldValue.serverTimestamp();
  const opt=options||{};
  const cloud=opt.cloud||global.MongoCloud;

  async function loadCanonical(uid){
    const r=refs(db,uid);
    const candidates=[];
    const reads=[
      ['appState',r.appState,false],
      ['legacy-financial',r.financial,false],
      ['settings-fallback',r.settings,true],
      ['profile-fallback',r.profile,true],
      ['user-root-fallback',r.root,true]
    ];
    for(const [source,ref,nested] of reads){
      try{
        const raw=snapshotData(await ref.get());
        if(!raw) continue;
        const c=nested && cloud&&typeof cloud.unwrapFinancialState==='function'
          ? cloud.unwrapFinancialState(raw,source)
          : (cloud&&typeof cloud.makeCandidate==='function'?cloud.makeCandidate(raw,source):{raw,source});
        if(c) candidates.push(c);
      }catch(e){
        if(typeof opt.onReadError==='function') opt.onReadError(source,e);
      }
    }
    if(cloud&&typeof cloud.selectLoadCandidate==='function'){
      const decision=cloud.selectLoadCandidate(candidates,opt.hasMeaningfulFinancialData||(()=>true));
      return {candidate:decision.selected||null,decision,candidates};
    }
    return {candidate:candidates[0]||null,candidates};
  }

  async function writeCanonical(uid,metadata){
    if(!metadata||!metadata.data) throw new Error('metadata.data required');
    const r=refs(db,uid);
    const payload=Object.assign({},metadata,{updatedAt:serverTimestamp()});
    const savedPaths=[];
    const errors=[];
    const attempts=[
      ['appState',()=>r.appState.set(payload,{merge:true})],
      ['financial',()=>r.financial.set(payload,{merge:true})],
      ['settings',()=>r.settings.set({financialState:payload,financialStateUpdatedAt:serverTimestamp(),financialStateUpdatedAtClient:payload.updatedAtClient},{merge:true})],
      ['profile',()=>r.profile.set({financialState:payload,financialStateUpdatedAt:serverTimestamp(),financialStateUpdatedAtClient:payload.updatedAtClient},{merge:true})],
      ['user-root',()=>r.root.set({uid,financialState:payload,financialStateUpdatedAt:serverTimestamp(),financialStateUpdatedAtClient:payload.updatedAtClient},{merge:true})]
    ];
    await Promise.all(attempts.map(async ([path,run])=>{
      try{ await run(); savedPaths.push(path); }
      catch(error){ errors.push({path,error}); if(typeof opt.onWriteError==='function') opt.onWriteError(path,error); }
    }));
    if(!savedPaths.length){ const err=new Error('ALL_CLOUD_WRITES_FAILED'); err.errors=errors; throw err; }
    return {ok:true,paths:savedPaths,errors};
  }

  return Object.freeze({loadCanonical,writeCanonical,refs:(uid)=>refs(db,uid)});
}

global.MongoFirebaseRuntimeDriver=Object.freeze({assertRuntime,createRuntimeDriver});
})(window);
