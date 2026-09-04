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

console.log('Möngö safe-delete index wiring test: PASS');
