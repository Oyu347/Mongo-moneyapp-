'use strict';
const assert=require('assert');
global.window=global;
require('../../src/features/transactions/transactions.js');

const T=global.MongoTransactions;
const input={
  type:'income',
  amount:100000,
  accountId:'khan-test',
  catName:'Ажил',
  catKey:'work',
  subcatName:'Цалин',
  subcatKey:'salary',
  date:'2026-08-30'
};
const made=T.makeTransaction(input,{uuid:'txn_income_test',timestamp:'2026-08-30T14:20:00Z'});
assert.strictEqual(made.ok,true,'valid income transaction should be created');
assert.strictEqual(made.txn.type,'income');
assert.strictEqual(made.txn.amount,100000);
assert.strictEqual(made.txn.accountId,'khan-test');
assert.strictEqual(made.txn.catName,'Ажил');
assert.strictEqual(made.txn.subcatName,'Цалин');

const noAccount=T.makeTransaction(Object.assign({},input,{accountId:''}));
assert.deepStrictEqual(noAccount,{ok:false,reason:'account_required'});

const noAmount=T.makeTransaction(Object.assign({},input,{amount:0}));
assert.deepStrictEqual(noAmount,{ok:false,reason:'amount_required'});

const list=[];
list.unshift(made.txn);
assert.strictEqual(list.length,1);
assert.strictEqual(T.summarize(list,[],'all').income,100000);
assert.strictEqual(T.summarize(list,[],'khan-test').income,100000);

console.log('Möngö income add flow regression: PASS');
