'use strict';
const assert=require('assert');global.window=global;require('../../src/services/cloud/cloud.js');require('../../src/services/cloud/firebase-runtime-driver.js');const D=global.MongoFirebaseRuntimeDriver;
function snap(data){return {exists:data!=null,data:()=>data};}
function makeRuntime(store,failWrites,failReads){const path=p=>p.join('/');function ref(parts){return {collection:n=>ref(parts.concat(n)),doc:n=>ref(parts.concat(n)),async get(){const p=path(parts);if(failReads&&failReads.has(p))throw new Error('read blocked '+p);return snap(store[p]||null);},async set(data){const p=path(parts);if(failWrites&&failWrites.has(p))throw new Error('blocked '+p);store[p]=data;}};}return {db:{collection:n=>ref([n])},firebase:{firestore:{FieldValue:{serverTimestamp(){return '__SERVER_TS__';}}}}};}
const empty=d=>!!d&&['txns','goals','debts','invests','moneyAccounts','accountTransfers','moneyLedger'].every(k=>Array.isArray(d[k])&&d[k].length===0);
(async()=>{
  const uid='u1',base='users/'+uid,paths=[base+'/appState/main',base+'/financial/main',base+'/settings/main',base+'/profile/main',base];
  const old={ownerUid:uid,updatedAtClient:'2026-08-31T09:00:00Z',data:{txns:[{id:'old'}]}};
  const store={[paths[0]]:old,[paths[1]]:old};
  const driver=D.createRuntimeDriver(makeRuntime(store),{cloud:global.MongoCloud,hasMeaningfulFinancialData:d=>!!(d&&d.txns&&d.txns.length)});
  let loaded=await driver.loadCanonical(uid);assert.strictEqual(loaded.candidate.raw.data.txns[0].id,'old');
  const barrier={active:true,clearedAt:'2026-08-31T10:00:00Z',data:{txns:[]}};loaded=await driver.loadCanonical(uid,{clearBarrier:barrier});assert.strictEqual(loaded.candidate.source,'local-clear-barrier','active clear barrier must block cloud resurrection');
  const data={txns:[],goals:[],debts:[],invests:[],moneyAccounts:[],accountTransfers:[],moneyLedger:[]};const meta={ownerUid:uid,updatedAtClient:'2026-08-31T10:00:00Z',clearedAt:'2026-08-31T10:00:00Z',data};
  const cleared=await driver.clearCanonical(uid,meta,{isEmpty:empty});assert.strictEqual(cleared.releaseBarrier,true);assert.strictEqual(cleared.verification.verified,true);
  const fail=new Set([paths[0]]),partial=D.createRuntimeDriver(makeRuntime({},fail),{cloud:global.MongoCloud});
  const normal=await partial.writeCanonical(uid,old);assert.strictEqual(normal.complete,false,'normal compatibility writes may remain partial');
  await assert.rejects(()=>partial.clearCanonical(uid,meta,{isEmpty:empty}),e=>e&&e.code==='PARTIAL_CLOUD_MIRROR_WRITE'&&e.missingPaths.includes('appState'));
  const staleStore={};paths.forEach(p=>{staleStore[p]=p.endsWith('/settings/main')||p.endsWith('/profile/main')||p===base?{financialState:old}:old;});const stale=D.createRuntimeDriver(makeRuntime(staleStore),{cloud:global.MongoCloud});const verify=await stale.verifyCanonicalClear(uid,meta.clearedAt,empty);assert.strictEqual(verify.verified,false);assert(verify.issues.length>=5);
  console.log('Möngö Firebase runtime driver Phase 2 reset regression: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
