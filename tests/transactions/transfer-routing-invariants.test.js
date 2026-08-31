'use strict';
const assert=require('assert');
global.window=global;
require('../../src/features/transactions/transactions.js');
const T=global.MongoTransactions;

// Ordinary account transfer: money only changes location.
const ordinary=T.makeInternalTransfer({amount:50000,fromId:'khan',toId:'khas',date:'2026-08-31'},{uuid:'tr_ordinary'});
assert.strictEqual(ordinary.ok,true);
assert.strictEqual(ordinary.transfer.purpose,'internal');

// Savings contribution: destination is a savings account/goal, not an expense.
const savings=T.makeTransfer({amount:30000,fromId:'khan',toId:'savings-car',purpose:'savings',targetId:'goal-car',date:'2026-08-31'},{uuid:'tr_savings'});
assert.strictEqual(savings.ok,true);
assert.strictEqual(savings.transfer.purpose,'savings');
assert.strictEqual(savings.transfer.targetId,'goal-car');

// Existing investment contribution: target identifies the existing investment.
const investment=T.makeTransfer({amount:40000,fromId:'khan',toId:'investment-ledger',purpose:'investment',targetId:'asset-khan-stock',date:'2026-08-31'},{uuid:'tr_investment'});
assert.strictEqual(investment.ok,true);
assert.strictEqual(investment.transfer.purpose,'investment');
assert.strictEqual(investment.transfer.targetId,'asset-khan-stock');

// New asset purchase: the source account is sufficient; no second money account is required.
const asset=T.makeTransfer({amount:150000000,fromId:'khan',purpose:'asset',targetId:'new-apartment',date:'2026-08-31'},{uuid:'tr_asset'});
assert.strictEqual(asset.ok,true);
assert.strictEqual(asset.transfer.toId,null);
assert.strictEqual(asset.transfer.purpose,'asset');

// Loan proceeds already received into an own account must be spent from that account;
// purchasing an asset must not create a second income/expense transaction by itself.
const loanProceeds=T.makeTransaction({type:'income',amount:150000000,accountId:'khan',catName:'Зээл',catKey:'loan-proceeds',date:'2026-08-31'},{uuid:'loan_proceeds'});
assert.strictEqual(loanProceeds.ok,true);
const totals=T.summarize([loanProceeds.txn],[asset.transfer],'all');
assert.strictEqual(totals.income,150000000);
assert.strictEqual(totals.expense,0,'asset purchase transfer must not duplicate expense');

// Invalid destinations remain blocked.
assert.strictEqual(T.makeInternalTransfer({amount:1000,fromId:'khan',toId:'khan'}).ok,false);
assert.strictEqual(T.makeTransfer({amount:1000,fromId:'khan',purpose:'investment'}).ok,false);

console.log('Möngö transfer routing invariants regression: PASS');
