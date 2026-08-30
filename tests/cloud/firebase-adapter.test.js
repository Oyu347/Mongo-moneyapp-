'use strict';
const assert=require('assert');
global.window=global;
require('../../src/services/cloud/firebase-adapter.js');
const A=global.MongoFirebaseAdapter;

assert.deepStrictEqual(A.assertDriver({}),{valid:false,missing:['loadCanonical','writeCanonical']});

const calls=[];
const driver={
 async loadCanonical(uid){calls.push(['load',uid]);return {data:{clientUpdatedAt:'2026-08-30T14:00:00Z'}};},
 async writeCanonical(uid,metadata){calls.push(['write',uid,metadata]);return {ok:true};}
};
const adapter=A.createFirebaseAdapter(driver);
assert.strictEqual(adapter.capabilities.destructiveDelete,false);
assert.strictEqual(adapter.capabilities.clearUsesTombstone,true);

(async()=>{
 const loaded=await adapter.load('test-user');
 assert.strictEqual(loaded.data.clientUpdatedAt,'2026-08-30T14:00:00Z');
 const metadata={data:{clientUpdatedAt:'2026-08-30T15:00:00Z'}};
 const result=await adapter.write('test-user',metadata);
 assert.strictEqual(result.ok,true);
 assert.deepStrictEqual(calls.map(x=>x[0]),['load','write']);
 await assert.rejects(()=>adapter.load(''),/uid required/);
 await assert.rejects(()=>adapter.write('test-user',{}),/metadata\.data required/);
 console.log('Möngö Firebase adapter contract regression: PASS');
})().catch(err=>{console.error(err);process.exitCode=1;});
