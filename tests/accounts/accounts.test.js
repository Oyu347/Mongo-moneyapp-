// Run with: node tests/accounts/accounts.test.js
'use strict';
const assert=require('assert'); global.window=global;
require('../../src/core/ledger.js'); require('../../src/features/accounts/accounts.js');
const A=global.MongoAccounts;
assert.strictEqual(A.normalizeType('bank'),'checking');
const metadata=[{id:'a',type:'bank',openingBalance:'12500'},{id:'b',type:'savings',openingBalance:-5,active:false}];
A.normalizeMetadata(metadata); assert.strictEqual(metadata[0].type,'checking'); assert.strictEqual(metadata[0].openingBalance,12500); assert.strictEqual(metadata[0].active,true); assert.strictEqual(metadata[1].openingBalance,0);
const legacy=A.ensureLegacyAccount([],25000,[{date:'2026-08-10'},{date:'2026-08-03'}],'mn','2026-08-30'); assert.strictEqual(legacy[0].id,'legacy_main'); assert.strictEqual(legacy[0].startDate,'2026-08-03');
const txns=[{id:1},{id:2,accountId:'cash'}]; A.assignMissingTransactionAccounts(txns,'bank'); assert.strictEqual(txns[0].accountId,'bank'); assert.strictEqual(txns[1].accountId,'cash');

const made=A.makeAccount({name:'  Daily bank  ',type:'bank',startDate:'2026-08-25',openingBalance:'50000'},'new-bank','2026-08-30');
assert.strictEqual(made.ok,true); assert.deepStrictEqual(made.account,{id:'new-bank',name:'Daily bank',type:'checking',startDate:'2026-08-25',openingBalance:50000,active:true});
assert.deepStrictEqual(A.makeAccount({name:'   ',type:'cash'},'x','2026-08-30'),{ok:false,reason:'name_required'});
const saving=A.makeAccount({name:'Goal',type:'savings',openingBalance:1000,interestMode:'compound',annualInterestRate:12,interestFrequency:'monthly',linkedGoalId:'g1'},'save-1','2026-08-30');
assert.strictEqual(saving.account.interestAccountId,'save-1','compound interest remains in the savings account');
const edit=A.editMetadata(saving.account,{name:'Goal 2',type:'savings',interestMode:'payout',annualInterestRate:10,interestAccountId:'new-bank',linkedGoalId:'g2'});
assert.strictEqual(edit.ok,true); assert.strictEqual(saving.account.name,'Goal 2'); assert.strictEqual(saving.account.interestAccountId,'new-bank'); assert.strictEqual(saving.account.linkedGoalId,'g2');

const accounts=[{id:'bank',type:'checking',openingBalance:100000,active:true},{id:'cash',type:'cash',openingBalance:10000,active:true},{id:'zero',type:'checking',openingBalance:0,active:true}];
const transfers=[{id:'t',amount:25000,fromId:'bank',toId:'cash',date:'2026-08-20'}];
const ledger=global.MongoLedgerCore.buildLedger({txns:[],debts:[],accountTransfers:transfers},[],'2026-08-30T00:00:00.000Z');
assert.strictEqual(A.accountTotal(accounts,ledger),110000,'internal transfer preserves total account money');
const change=A.openingBalanceChange('bank',120000,accounts,ledger); assert.deepStrictEqual(change,{before:100000,after:120000,delta:20000,current:75000,result:95000,changed:true});
assert.strictEqual(accounts[0].openingBalance,100000,'preview must not mutate opening balance'); assert.strictEqual(transfers.length,1,'opening balance preview must not rewrite history');
assert.strictEqual(A.canDeactivate('bank',accounts,ledger),false); assert.deepStrictEqual(A.deactivateMetadata('bank',accounts,ledger),{ok:false,reason:'non_zero_balance'}); assert.strictEqual(accounts[0].active,true);
const zeroResult=A.deactivateMetadata('zero',accounts,ledger); assert.strictEqual(zeroResult.ok,true); assert.strictEqual(accounts[2].active,false); assert.strictEqual(transfers.length,1,'deactivation must not delete historical transfers');
const rows=A.transferRows('cash',accounts,transfers); assert.strictEqual(rows.length,1); assert.strictEqual(rows[0].amount,25000);
console.log('Möngö accounts regression tests: PASS');
