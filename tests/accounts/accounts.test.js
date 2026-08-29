// Run with: node tests/accounts/accounts.test.js
'use strict';

const assert = require('assert');
global.window = global;
require('../../src/core/ledger.js');
require('../../src/features/accounts/accounts.js');

const A = global.MongoAccounts;

assert.strictEqual(A.normalizeType('bank'), 'checking');
assert.strictEqual(A.normalizeType('cash'), 'cash');
assert.strictEqual(A.normalizeType('savings'), 'savings');

const metadata = [{ id: 'a', type: 'bank', openingBalance: '12500' }, { id: 'b', type: 'savings', openingBalance: -5, active: false }];
A.normalizeMetadata(metadata);
assert.strictEqual(metadata[0].type, 'checking');
assert.strictEqual(metadata[0].openingBalance, 12500);
assert.strictEqual(metadata[0].active, true);
assert.strictEqual(metadata[1].openingBalance, 0);
assert.strictEqual(metadata[1].active, false);

const legacy = A.ensureLegacyAccount([], 25000, [{ date: '2026-08-10' }, { date: '2026-08-03' }], 'mn', '2026-08-30');
assert.strictEqual(legacy.length, 1);
assert.strictEqual(legacy[0].id, 'legacy_main');
assert.strictEqual(legacy[0].type, 'cash');
assert.strictEqual(legacy[0].startDate, '2026-08-03');
assert.strictEqual(legacy[0].openingBalance, 25000);

const txns = [{ id: 1 }, { id: 2, accountId: 'cash' }];
A.assignMissingTransactionAccounts(txns, 'bank');
assert.strictEqual(txns[0].accountId, 'bank');
assert.strictEqual(txns[1].accountId, 'cash');

const accounts = [{ id: 'bank', type: 'checking', openingBalance: 100000, active: true }, { id: 'cash', type: 'cash', openingBalance: 10000, active: true }];
const ledger = global.MongoLedgerCore.buildLedger({ txns: [], debts: [], accountTransfers: [{ id: 't', amount: 25000, fromId: 'bank', toId: 'cash', date: '2026-08-20' }] }, [], '2026-08-30T00:00:00.000Z');
assert.strictEqual(A.accountTotal(accounts, ledger), 110000, 'internal transfer preserves total account money');
assert.strictEqual(A.canDeactivate('bank', accounts, ledger), false, 'non-zero account cannot be safely deactivated');

const rows = A.transferRows('cash', accounts, [{ id: 't', amount: 25000, fromId: 'bank', toId: 'cash', date: '2026-08-20' }]);
assert.strictEqual(rows.length, 1);
assert.strictEqual(rows[0].amount, 25000);

console.log('Möngö accounts regression tests: PASS');
