'use strict';
const assert=require('assert');
global.window=global;
require('../../src/features/transactions/transactions.js');

const T=global.MongoTransactions;
const income={type:'income',amount:100000,accountId:'khan-test',catName:'Ажил',catKey:'work',subcatName:'Цалин',subcatKey:'salary',date:'2026-08-30'};
const expense={type:'expense',amount:25000,accountId:'khan-test',catName:'Хоол',catKey:'food',subcatName:'Хүнс',subcatKey:'groceries',date:'2026-08-30'};
const madeIncome=T.makeTransaction(income,{uuid:'txn_income_test',timestamp:'2026-08-30T14:20:00Z'});
const madeExpense=T.makeTransaction(expense,{uuid:'txn_expense_test',timestamp:'2026-08-30T14:21:00Z'});
assert.strictEqual(madeIncome.ok,true,'valid income transaction should be created');
assert.strictEqual(madeExpense.ok,true,'valid expense transaction should be created');
assert.strictEqual(madeIncome.txn.accountId,'khan-test');
assert.strictEqual(madeExpense.txn.accountId,'khan-test');
assert.deepStrictEqual(T.makeTransaction(Object.assign({},income,{accountId:''})),{ok:false,reason:'account_required'});
assert.deepStrictEqual(T.makeTransaction(Object.assign({},income,{amount:0})),{ok:false,reason:'amount_required'});

const list=[madeExpense.txn,madeIncome.txn];
let totals=T.summarize(list,[],'all');
assert.strictEqual(totals.income,100000);
assert.strictEqual(totals.expense,25000);

const madeTransfer=T.makeInternalTransfer({amount:40000,fromId:'khan-test',toId:'cash-test',date:'2026-08-30'},{uuid:'txn_transfer_test',timestamp:'2026-08-30T14:22:00Z'});
assert.strictEqual(madeTransfer.ok,true,'valid internal transfer should be created');
assert.strictEqual(madeTransfer.transfer.purpose,'internal');
assert.strictEqual(madeTransfer.transfer.fromId,'khan-test');
assert.strictEqual(madeTransfer.transfer.toId,'cash-test');

totals=T.summarize(list,[madeTransfer.transfer],'all');
assert.strictEqual(totals.income,100000,'internal transfer must not inflate income');
assert.strictEqual(totals.expense,25000,'internal transfer must not inflate expense');
assert.strictEqual(totals.transferIn,40000);
assert.strictEqual(totals.transferOut,40000);
const source=T.summarize(list,[madeTransfer.transfer],'khan-test');
const destination=T.summarize(list,[madeTransfer.transfer],'cash-test');
assert.strictEqual(source.transferOut,40000);
assert.strictEqual(source.transferIn,0);
assert.strictEqual(destination.transferIn,40000);
assert.strictEqual(destination.transferOut,0);

console.log('Möngö income / expense / transfer flow regression: PASS');
