// Run with: node tests/core/ledger.test.js
'use strict';

const assert = require('assert');
global.window = global;
require('../../src/core/ledger.js');

const L = global.MongoLedgerCore;
const at = '2026-08-29T00:00:00.000Z';

const accounts = [
  { id: 'bank', openingBalance: 100000 },
  { id: 'cash', openingBalance: 10000 },
  { id: 'savings', openingBalance: 0 }
];

const state = {
  txns: [
    { id: 'income1', type: 'income', amount: 50000, accountId: 'bank', date: '2026-08-01' },
    { id: 'expense1', type: 'expense', amount: 20000, accountId: 'bank', date: '2026-08-02' }
  ],
  accountTransfers: [
    { id: 'cash1', amount: 30000, fromId: 'bank', toId: 'cash', date: '2026-08-03' },
    { id: 'save1', amount: 15000, fromId: 'bank', toId: 'savings', purpose: 'savings', targetId: 'goal1', date: '2026-08-04' }
  ],
  debts: [
    {
      id: 'loan1', name: 'Test loan', fundingMode: 'existing', fundingAmount: 40000,
      fundingAccountId: 'bank', startDate: '2026-08-05',
      payments: [
        { id: 'pay1', accountId: 'bank', date: '2026-08-06', total: 12000, principal: 9000, interest: 2000, extraPrincipal: 1000 }
      ]
    }
  ]
};

const ledger = L.buildLedger(state, [], at);

assert.strictEqual(ledger.length, 6, 'expected six unified ledger entries');
assert.deepStrictEqual(L.validateLedger(ledger), [], 'ledger should validate');
assert.strictEqual(L.needsRebuild(state, ledger), false, 'fresh ledger should not need rebuild');

assert.strictEqual(L.accountBalance('bank', accounts, ledger), 113000, 'bank balance');
assert.strictEqual(L.accountBalance('cash', accounts, ledger), 40000, 'cash balance');
assert.strictEqual(L.accountBalance('savings', accounts, ledger), 15000, 'savings balance');
assert.strictEqual(L.totalAccountMoney(accounts, ledger), 168000, 'total account money');

const transferOnly = L.buildLedger({
  txns: [], debts: [],
  accountTransfers: [{ id: 't1', amount: 25000, fromId: 'bank', toId: 'cash', date: '2026-08-10' }]
}, [], at);
assert.strictEqual(L.totalAccountMoney(accounts, transferOnly), 110000, 'internal transfer must not change total money');
assert.strictEqual(L.accountBalance('bank', accounts, transferOnly), 75000, 'transfer source decreases');
assert.strictEqual(L.accountBalance('cash', accounts, transferOnly), 35000, 'transfer destination increases');

const payment = ledger.find(e => e.kind === 'loan_payment');
assert(payment, 'loan payment entry exists');
assert.strictEqual(payment.amount, 12000);
assert.strictEqual(payment.principal + payment.interest + payment.extraPrincipal, payment.amount, 'loan split equals one payment amount');
assert.strictEqual(ledger.filter(e => e.kind === 'expense').length, 1, 'loan interest is not duplicated as ordinary expense');

const savings = ledger.find(e => e.id === 'transfer:save1');
assert.strictEqual(savings.kind, 'savings_transfer', 'savings movement is a transfer kind');

console.log('Möngö ledger core regression tests: PASS');
