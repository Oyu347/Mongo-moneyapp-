'use strict';
const assert=require('assert');
global.window=global;
require('../../src/features/transactions/transactions.js');

const T=global.MongoTransactions;
const income={
  type:'income', amount:100000, accountId:'khan-test',
  catName:'Ажил', catKey:'work', subcatName:'Цалин', subcatKey:'salary', date:'2026-08-30'
};
const expense={
  type:'expense', amount:25000, accountId:'khan-test',
  catName:'Хоол', catKey:'food', subcatName:'Хүнс', subcatKey:'groceries', date:'2026-08-30'
};

const madeIncome=T.makeTransaction(income,{uuid:'txn_income_test',timestamp:'2026-08-30T14:20:00Z'});
assert.strictEqual(madeIncome.ok,true,'valid income transaction should be created');
assert.strictEqual(madeIncome.txn.type,'income');
assert.strictEqual(madeIncome.txn.amount,100000);
assert.strictEqual(madeIncome.txn.accountId,'khan-test');
assert.strictEqual(madeIncome.txn.catName,'Ажил');
assert.strictEqual(madeIncome.txn.subcatName,'Цалин');

const madeExpense=T.makeTransaction(expense,{uuid:'txn_expense_test',timestamp:'2026-08-30T14:21:00Z'});
assert.strictEqual(madeExpense.ok,true,'valid expense transaction should be created');
assert.strictEqual(madeExpense.txn.type,'expense');
assert.strictEqual(madeExpense.txn.amount,25000);
assert.strictEqual(madeExpense.txn.accountId,'khan-test');

const noAccount=T.makeTransaction(Object.assign({},income,{accountId:''}));
assert.deepStrictEqual(noAccount,{ok:false,reason:'account_required'});
const noAmount=T.makeTransaction(Object.assign({},income,{amount:0}));
assert.deepStrictEqual(noAmount,{ok:false,reason:'amount_required'});

const list=[];
list.unshift(madeIncome.txn);
list.unshift(madeExpense.txn);
const all=T.summarize(list,[],'all');
assert.strictEqual(all.income,100000);
assert.strictEqual(all.expense,25000);
assert.strictEqual(all.net,75000);

// Transfer is an internal money movement: it must not become income/expense.
const transfer={id:'txn_transfer_test',type:'transfer',amount:40000,fromAccountId:'khan-test',toAccountId:'cash-test',date:'2026-08-30'};
list.unshift(transfer);
const afterTransfer=T.summarize(list,[],'all');
assert.strictEqual(afterTransfer.income,100000);
assert.strictEqual(afterTransfer.expense,25000);
assert.strictEqual(afterTransfer.net,75000);

console.log('Möngö income / expense / transfer flow regression: PASS');
