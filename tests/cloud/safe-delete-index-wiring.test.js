'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');

const html=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
const match=html.match(/<script id="mongo-v44124-transaction-journal-reset">([\s\S]*?)<\/script>/);
assert(match,'hard-reset script must exist');
const resetScript=match[1];

assert(resetScript.includes('runSafeHardReset'),'Delete All Data must use the safe reset orchestrator');
assert(!resetScript.includes('loadFinancialData({force:true})'),'Delete All Data must not force-load deleted cloud data');
assert.strictEqual((resetScript.match(/svc\.clearFinancialData\(\)/g)||[]).length,1,'Delete All Data must invoke the cloud clear operation exactly once');
assert(!resetScript.includes('/^mongo_sync_queue_/'),'post-clear cleanup must preserve a queued clear tombstone');
assert(resetScript.includes('clear-barrier-missing'),'Delete All Data must verify its anti-resurrection barrier before reload');
assert(html.includes('return cloudClearSynced;'),'Cloud clear must not report success while its tombstone is only queued');
assert.strictEqual((html.match(/if\(resetBarrierActive\(\)\)\{write(?:Journal|Ledger)\(\[\]\);return false;\}/g)||[]).length,2,'transaction recovery stores must not resurrect rows after a clear barrier');
assert(html.includes('if(!mirrorCheck.complete){'),'every Cloud write, including a clear tombstone, must cover all five mirrors');
assert(!html.includes("reason!=='clear-tombstone'"),'a destructive clear must never accept partial mirror coverage');
assert(html.includes('verifyCloudFinancialClear(uid,clearedAt)'),'Delete All Data must read all mirrors back after writing the tombstone');
assert(html.includes("new Error('CLEAR_VERIFICATION_FAILED')"),'Delete All Data must fail closed when read-back verification is incomplete');
assert(html.includes("['user-root',rootCloudDocRef(uid),true]"),'clear verification must include the fifth user-root mirror');
assert(html.includes('setTimeout(resolve,4500)'),'Delete All Data must retain the V44.12.11 quarantine delay for in-flight autosaves');
assert.strictEqual((html.match(/await writeCloud\(emptyData,'clear-tombstone',uid\)/g)||[]).length,2,'Delete All Data must write the empty tombstone in two passes');
assert(html.includes('const finalVerification=await verifyCloudFinancialClear(uid,clearedAt)'),'Delete All Data must verify all mirrors after the second tombstone pass');
assert(html.includes('window.MONGO_LAST_CLEAR_FAILURE'),'Delete All Data must retain actionable Cloud failure details');
assert(html.includes("const isClearTombstone=reason==='clear-tombstone';"),'Cloud writer must identify the destructive tombstone explicitly');
assert(html.includes('(!isClearTombstone&&!accountReadyForCloud())'),'only a clear tombstone may bypass transient sync readiness');
assert(html.includes('MONGO_CLOUD_PARTIAL_STATE_BLOCKED&&!isClearTombstone'),'partial-state quarantine must not block an explicit delete tombstone');
assert(html.includes("(!isClearTombstone&&(window._authUid!==uid||!accountReadyForCloud()))"),'transient app readiness must remain strict for normal saves but not block an authenticated delete');

console.log('Möngö safe-delete index wiring test: PASS');
