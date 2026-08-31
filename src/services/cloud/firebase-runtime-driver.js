// Möngö Firebase runtime compatibility driver — Phase 2 reset safety.
(function(global){
'use strict';
function assertRuntime(runtime){const r=runtime||{},missing=[];if(!r.db||typeof r.db.collection!=='function')missing.push('db.collection');if(!r.firebase||!r.firebase.firestore||!r.firebase.firestore.FieldValue||typeof r.firebase.firestore.FieldValue.serverTimestamp!=='function')missing.push('firebase.firestore.FieldValue.serverTimestamp');return {valid:missing.length===0,missing};}
function refs(db,uid){if(!uid)throw new Error('uid required');const root=db.collection('users').doc(uid);return Object.freeze({root,appState:root.collection('appState').doc('main'),financial:root.collection('financial').doc('main'),settings:root.collection('settings').doc('main'),profile:root.collection('profile').doc('main')});}
function snapshotData(snap){return snap&&snap.exists&&typeof snap.data==='function'?snap.data():null;}
function createRuntimeDriver(runtime,options){
  const check=assertRuntime(runtime);if(!check.valid)throw new Error('Invalid Firebase runtime: missing '+check.missing.join(', '));
  const db=runtime.db,serverTimestamp=()=>runtime.firebase.firestore.FieldValue.serverTimestamp(),opt=options||{},cloud=opt.cloud||global.MongoCloud;
  async function readMirrors(uid){
    const r=refs(db,uid),rows=[],errors=[];
    const reads=[['appState',r.appState,false],['financial',r.financial,false],['settings',r.settings,true],['profile',r.profile,true],['user-root',r.root,true]];
    for(const [path,ref,nested] of reads){try{const container=snapshotData(await ref.get()),raw=nested?(container&&container.financialState):container;rows.push({path,exists:!!raw,raw:raw||null});}catch(error){errors.push({path,error});if(typeof opt.onReadError==='function')opt.onReadError(path,error);}}
    return {rows,errors};
  }
  async function loadCanonical(uid,loadOptions){
    const read=await readMirrors(uid),candidates=[];
    read.rows.forEach(row=>{if(!row.raw)return;const source=row.path==='financial'?'legacy-financial':row.path==='settings'?'settings-fallback':row.path==='profile'?'profile-fallback':row.path==='user-root'?'user-root-fallback':'appState';const c=cloud&&typeof cloud.makeCandidate==='function'?cloud.makeCandidate(row.raw,source):{raw:row.raw,source};if(c)candidates.push(c);});
    if(loadOptions&&loadOptions.clearBarrier&&cloud&&typeof cloud.selectLoadCandidateWithBarrier==='function'){
      const decision=cloud.selectLoadCandidateWithBarrier(candidates,opt.hasMeaningfulFinancialData||(()=>true),loadOptions&&loadOptions.clearBarrier);
      return {candidate:decision.selected||null,decision,candidates,mirrors:read};
    }
    if(cloud&&typeof cloud.selectSafeLoadCandidate==='function'){
      const decision=cloud.selectSafeLoadCandidate(candidates);
      return {candidate:decision.selected||null,decision,candidates,mirrors:read,blocked:decision.blocked===true};
    }
    if(cloud&&typeof cloud.selectLoadCandidate==='function'){const decision=cloud.selectLoadCandidate(candidates,opt.hasMeaningfulFinancialData||(()=>true));return {candidate:decision.selected||null,decision,candidates,mirrors:read};}
    return {candidate:candidates[0]||null,candidates,mirrors:read};
  }
  async function writeCanonical(uid,metadata,writeOptions){
    if(!metadata||!metadata.data)throw new Error('metadata.data required');const r=refs(db,uid),payload=Object.assign({},metadata,{updatedAt:serverTimestamp()}),savedPaths=[],errors=[];
    const attempts=[['appState',()=>r.appState.set(payload,{merge:true})],['financial',()=>r.financial.set(payload,{merge:true})],['settings',()=>r.settings.set({financialState:payload,financialStateUpdatedAt:serverTimestamp(),financialStateUpdatedAtClient:payload.updatedAtClient},{merge:true})],['profile',()=>r.profile.set({financialState:payload,financialStateUpdatedAt:serverTimestamp(),financialStateUpdatedAtClient:payload.updatedAtClient},{merge:true})],['user-root',()=>r.root.set({uid,financialState:payload,financialStateUpdatedAt:serverTimestamp(),financialStateUpdatedAtClient:payload.updatedAtClient},{merge:true})]];
    await Promise.all(attempts.map(async([path,run])=>{try{await run();savedPaths.push(path);}catch(error){errors.push({path,error});if(typeof opt.onWriteError==='function')opt.onWriteError(path,error);}}));
    if(!savedPaths.length){const err=new Error('ALL_CLOUD_WRITES_FAILED');err.code='ALL_CLOUD_WRITES_FAILED';err.errors=errors;throw err;}
    const completeness=cloud&&typeof cloud.completeMirrorWrite==='function'?cloud.completeMirrorWrite(savedPaths):{complete:savedPaths.length===5,missing:[]};
    const requireAll=!(writeOptions&&writeOptions.allowPartialCompatibility===true);
    if(requireAll&&!completeness.complete){const err=new Error('PARTIAL_CLOUD_MIRROR_WRITE');err.code='PARTIAL_CLOUD_MIRROR_WRITE';err.paths=savedPaths;err.missingPaths=completeness.missing;err.errors=errors;throw err;}
    return {ok:true,paths:savedPaths,errors,complete:completeness.complete,missingPaths:completeness.missing};
  }
  async function verifyCanonicalClear(uid,clearedAt,isEmpty){
    const expected=Date.parse(clearedAt||'')||0,read=await readMirrors(uid),issues=[];
    read.errors.forEach(x=>issues.push({path:x.path,reason:'read_failed'}));
    read.rows.forEach(row=>{if(!row.exists){issues.push({path:row.path,reason:'missing_mirror'});return;}const raw=row.raw||{},actual=Date.parse(raw.clearedAt||'')||0;if(!actual||actual<expected)issues.push({path:row.path,reason:'missing_or_old_clear_marker'});else if(typeof isEmpty==='function'&&!isEmpty(raw.data))issues.push({path:row.path,reason:'data_not_empty'});});
    return {verified:issues.length===0,issues,mirrors:read.rows};
  }
  async function clearCanonical(uid,metadata,clearOptions){
    if(!metadata||!metadata.clearedAt)throw new Error('metadata.clearedAt required');
    const write=await writeCanonical(uid,metadata,{requireAll:true});
    const verification=await verifyCanonicalClear(uid,metadata.clearedAt,clearOptions&&clearOptions.isEmpty);
    if(!verification.verified){const err=new Error('CLEAR_VERIFICATION_FAILED');err.code='CLEAR_VERIFICATION_FAILED';err.verification=verification;throw err;}
    return {ok:true,write,verification,releaseBarrier:true};
  }
  return Object.freeze({loadCanonical,writeCanonical,clearCanonical,verifyCanonicalClear,readMirrors,refs:uid=>refs(db,uid)});
}
global.MongoFirebaseRuntimeDriver=Object.freeze({assertRuntime,createRuntimeDriver});
})(window);
