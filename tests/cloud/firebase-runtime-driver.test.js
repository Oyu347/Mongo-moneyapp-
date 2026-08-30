'use strict';
const assert=require('assert');
global.window=global;
require('../../src/services/cloud/cloud.js');
require('../../src/services/cloud/firebase-runtime-driver.js');
const D=global.MongoFirebaseRuntimeDriver;

function snap(data){return {exists:data!=null,data:()=>data};}
function makeRuntime(store,failWrites){
  const path=(parts)=>parts.join('/');
  function ref(parts){return {
    collection(name){return ref(parts.concat(name));},
    doc(id){return ref(parts.concat(id));},
    async get(){return snap(store[path(parts)]||null);},
    async set(data){const p=path(parts);if(failWrites&&failWrites.has(p))throw new Error('blocked '+p);store[p]=data;}
  };}
  return {
    db:{collection(name){return ref([name]);}},
    firebase:{firestore:{FieldValue:{serverTimestamp(){return '__SERVER_TS__';}}}}
  };
}

assert.strictEqual(D.assertRuntime({}).valid,false);

(async()=>{
  const uid='u1';
  const store={
    ['users/'+uid+'/appState/main']:{ownerUid:uid,updatedAtClient:'2026-08-30T10:00:00Z',data:{txns:[{id:1}],clientUpdatedAt:'2026-08-30T10:00:00Z'}},
    ['users/'+uid+'/financial/main']:{ownerUid:uid,updatedAtClient:'2026-08-30T11:00:00Z',data:{txns:[{id:2}],clientUpdatedAt:'2026-08-30T11:00:00Z'}}
  };
  const driver=D.createRuntimeDriver(makeRuntime(store),{
    cloud:global.MongoCloud,
    hasMeaningfulFinancialData:d=>Array.isArray(d&&d.txns)&&d.txns.length>0
  });
  const loaded=await driver.loadCanonical(uid);
  assert(loaded.candidate,'candidate missing');
  assert.strictEqual(loaded.candidate.source,'legacy-financial');
  assert.strictEqual(loaded.candidate.raw.data.txns[0].id,2);

  const metadata={ownerUid:uid,updatedAtClient:'2026-08-30T12:00:00Z',data:{txns:[{id:3}]}};
  const result=await driver.writeCanonical(uid,metadata);
  assert.deepStrictEqual(result.paths.sort(),['appState','financial','profile','settings','user-root'].sort());
  assert.strictEqual(store['users/'+uid+'/appState/main'].data.txns[0].id,3);
  assert.strictEqual(store['users/'+uid+'/settings/main'].financialState.data.txns[0].id,3);
  assert.strictEqual(store['users/'+uid].financialState.data.txns[0].id,3);

  const fail=new Set(['users/'+uid+'/appState/main']);
  const partial=D.createRuntimeDriver(makeRuntime({},fail),{cloud:global.MongoCloud});
  const partialResult=await partial.writeCanonical(uid,metadata);
  assert(!partialResult.paths.includes('appState'));
  assert(partialResult.paths.includes('financial'));

  const allPaths=new Set(['users/'+uid+'/appState/main','users/'+uid+'/financial/main','users/'+uid+'/settings/main','users/'+uid+'/profile/main','users/'+uid]);
  const blocked=D.createRuntimeDriver(makeRuntime({},allPaths),{cloud:global.MongoCloud});
  await assert.rejects(()=>blocked.writeCanonical(uid,metadata),/ALL_CLOUD_WRITES_FAILED/);
  console.log('Möngö Firebase runtime driver regression: PASS');
})().catch(err=>{console.error(err);process.exitCode=1;});
