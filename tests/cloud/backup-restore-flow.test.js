'use strict';
const assert=require('assert');
global.window=global;
require('../../src/services/cloud/cloud.js');
const C=global.MongoCloud;
const meaningful=d=>!!(d&&Array.isArray(d.txns)&&d.txns.length);

// 1) Backup snapshot is meaningful and can be selected when it is the newest valid copy.
const backup=C.makeCandidate({updatedAtClient:'2026-08-30T10:00:00Z',data:{txns:[{id:'backup-txn'}],clientUpdatedAt:'2026-08-30T10:00:00Z'}},'backup');
const olderCloud=C.makeCandidate({updatedAtClient:'2026-08-30T09:00:00Z',data:{txns:[{id:'old-cloud'}],clientUpdatedAt:'2026-08-30T09:00:00Z'}},'appState');
let selected=C.selectLoadCandidate([olderCloud,backup],meaningful);
assert.strictEqual(selected.selected.source,'backup','newest meaningful backup should be restorable');

// 2) A later clear tombstone must block both an older cloud copy and an older backup.
const clear=C.makeCandidate({updatedAtClient:'2026-08-30T11:00:00Z',clearedAt:'2026-08-30T11:00:00Z',data:{txns:[],clientUpdatedAt:'2026-08-30T11:00:00Z'}},'clear');
selected=C.selectLoadCandidate([olderCloud,backup,clear],meaningful);
assert.strictEqual(selected.clearMarker,true,'newest clear marker must be authoritative');
assert.strictEqual(selected.selected.source,'clear','older backup must not resurrect data after clear');

// 3) Pre-clear queued writes are removed; tombstone and genuinely newer writes survive.
const barrier={clearedAt:'2026-08-30T11:00:00Z'};
const queue=[
 {id:'old-cloud-write',reason:'auto',createdAt:'2026-08-30T10:30:00Z'},
 {id:'clear-write',reason:'clear-tombstone',createdAt:'2026-08-30T11:00:00Z'},
 {id:'post-clear-write',reason:'auto',createdAt:'2026-08-30T11:30:00Z'}
];
assert.deepStrictEqual(C.filterQueueAfterClear(queue,barrier).map(x=>x.id),['clear-write','post-clear-write']);

// 4) Restore after clear is allowed only when represented as a genuinely newer state.
const restored=C.makeCandidate({updatedAtClient:'2026-08-30T12:00:00Z',data:{txns:[{id:'restored'}],clientUpdatedAt:'2026-08-30T12:00:00Z'}},'backup-restore');
selected=C.selectLoadCandidate([clear,restored],meaningful);
assert.strictEqual(selected.clearMarker,false,'newer restored state supersedes an older clear marker');
assert.strictEqual(selected.selected.source,'backup-restore');

// 5) Local/cloud conflict ordering preserves the newest valid state.
assert.strictEqual(C.chooseCloudOrLocal({localHas:true,cloudHas:true,local:{clientUpdatedAt:'2026-08-30T13:00:00Z'},cloud:{clientUpdatedAt:'2026-08-30T12:00:00Z'}}).winner,'local');
assert.strictEqual(C.chooseCloudOrLocal({localHas:true,cloudHas:true,local:{clientUpdatedAt:'2026-08-30T12:00:00Z'},cloud:{clientUpdatedAt:'2026-08-30T13:00:00Z'}}).winner,'cloud');

// 6) Clear metadata carries a tombstone timestamp into cloud backup metadata.
const meta=C.writeMetadata({uid:'u1',version:'v1',updatedAtClient:'2026-08-30T11:00:00Z',clientId:'c1',lastOperationId:'clear-op',data:{txns:[],clientUpdatedAt:'2026-08-30T11:00:00Z'},reason:'clear-tombstone'});
assert.strictEqual(meta.clearedAt,'2026-08-30T11:00:00Z');
assert.deepStrictEqual(meta.backup.data,meta.data);

console.log('Möngö backup/clear/restore cloud flow regression: PASS');
