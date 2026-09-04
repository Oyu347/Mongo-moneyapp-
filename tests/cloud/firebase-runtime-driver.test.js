'use strict';
const assert=require('assert');global.window=global;require('../../src/services/cloud/cloud.js');require('../../src/services/cloud/firebase-runtime-driver.js');const D=global.MongoFirebaseRuntimeDriver;
function snap(data){return {exists:data!=null,data:()=>data};}
function makeRuntime(store,failWrites,failReads){const path=p=>p.join('/');function ref(parts){return {collection:n=>ref(parts.concat(n)),doc:n=>ref(parts.concat(n)),async get(){const p=path(parts);if(failReads&&failReads.has(p))throw new Error('read blocked '+p);return snap(store[p]||null);},async set(data){const p=path(parts);if(failWrites&&failWrites.has(p))throw new Error('blocked '+p);store[p]=data;}};}return {db:{collection:n=>ref([n])},firebase:{firestore:{FieldValue:{serverTimestamp(){return '__SERVER_TS__';}}}}};}
const empty=d=>!!d&&['txns','goals','debts','invests','moneyAccounts','accountTransfers','moneyLedger'].every(k=>Array.isArray(d[k])&&d[k].length===0);
const full=(extra={})=>Object.assign({txns:[],goals:[],debts:[],invests:[],moneyAccounts:[],accountTransfers:[],moneyLedger:[],moneyLedgerTombstones:[],moneyLedgerRevision:0,budgets:{}},extra);
(async()=>{
  const uid='u1',base='users/'+uid,paths=[base+'/appState/main',base+'/financial/main',base+'/settings/main',base+'/profile/main',base];
  const old={ownerUid:uid,updatedAtClient:'2026-08-31T09:00:00Z',data:full({txns:[{id:'old'}],moneyLedger:[{id:'txn:old'}],moneyLedgerRevision:3})};
  const store={[paths[0]]:old,[paths[1]]:old};
  const driver=D.createRuntimeDriver(makeRuntime(store),{cloud:global.MongoCloud,hasMeaningfulFinancialData:d=>!!(d&&d.txns&&d.txns.length)});
  let loaded=await driver.loadCanonical(uid);assert.strictEqual(loaded.candidate.raw.data.txns[0].id,'old');
  const barrier={active:true,clearedAt:'2026-08-31T10:00:00Z',data:{txns:[]}};loaded=await driver.loadCanonical(uid,{clearBarrier:barrier});assert.strictEqual(loaded.candidate.source,'local-clear-barrier','active clear barrier must block cloud resurrection');
  const data=full();const meta={ownerUid:uid,updatedAtClient:'2026-08-31T10:00:00Z',clearedAt:'2026-08-31T10:00:00Z',data};
  const cleared=await driver.clearCanonical(uid,meta,{isEmpty:empty});assert.strictEqual(cleared.releaseBarrier,true);assert.strictEqual(cleared.verification.verified,true);
  const fail=new Set([paths[0]]),partial=D.createRuntimeDriver(makeRuntime({},fail),{cloud:global.MongoCloud});
  await assert.rejects(()=>partial.writeCanonical(uid,old),e=>e&&e.code==='PARTIAL_CLOUD_MIRROR_WRITE','normal writes must reject partial mirror commits');
  const normal=await partial.writeCanonical(uid,old,{allowPartialCompatibility:true});assert.strictEqual(normal.complete,false,'explicit legacy compatibility mode may remain partial');
  await assert.rejects(()=>partial.clearCanonical(uid,meta,{isEmpty:empty}),e=>e&&e.code==='PARTIAL_CLOUD_MIRROR_WRITE'&&e.missingPaths.includes('appState'));
  const staleStore={};paths.forEach(p=>{staleStore[p]=p.endsWith('/settings/main')||p.endsWith('/profile/main')||p===base?{financialState:old}:old;});const stale=D.createRuntimeDriver(makeRuntime(staleStore),{cloud:global.MongoCloud});const verify=await stale.verifyCanonicalClear(uid,meta.clearedAt,empty);assert.strictEqual(verify.verified,false);assert(verify.issues.length>=5);
  const partialNew={ownerUid:uid,updatedAtClient:'2026-08-31T12:00:00Z',data:{moneyAccounts:[{id:'bank'}],txns:[]}};
  const richOld={ownerUid:uid,updatedAtClient:'2026-08-31T11:00:00Z',data:full({txns:[{id:'salary'}],goals:[{id:'car'}],debts:[{id:'loan'}],invests:[{id:'home'}],moneyAccounts:[{id:'bank'}],moneyLedger:[{id:'txn:salary'}],moneyLedgerRevision:9})};
  const mixedStore={[paths[0]]:partialNew,[paths[1]]:richOld,[paths[2]]:{financialState:partialNew},[paths[3]]:{financialState:richOld},[paths[4]]:{financialState:partialNew}};
  const mixed=D.createRuntimeDriver(makeRuntime(mixedStore),{cloud:global.MongoCloud});const safe=await mixed.loadCanonical(uid);assert.strictEqual(safe.candidate.raw.data.txns[0].id,'salary','newer partial mirror must not replace older complete state');assert.strictEqual(safe.decision.quarantined.length,3);
  const onlyPartial=D.createRuntimeDriver(makeRuntime({[paths[0]]:partialNew}),{cloud:global.MongoCloud});const blocked=await onlyPartial.loadCanonical(uid);assert.strictEqual(blocked.candidate,null);assert.strictEqual(blocked.blocked,true,'partial-only cloud state must be blocked');
  const missingStore={};paths.slice(0,4).forEach(p=>{missingStore[p]=p.endsWith('/settings/main')||p.endsWith('/profile/main')?{financialState:meta}:meta;});const missingVerify=D.createRuntimeDriver(makeRuntime(missingStore),{cloud:global.MongoCloud});const missingResult=await missingVerify.verifyCanonicalClear(uid,meta.clearedAt,empty);assert.strictEqual(missingResult.verified,false);assert(missingResult.issues.some(x=>x.path==='user-root'&&x.reason==='missing_mirror'));
  console.log('Möngö Firebase runtime driver Phase 2 reset regression: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
