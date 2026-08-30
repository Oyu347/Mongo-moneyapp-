'use strict';
const assert=require('assert');global.window=global;require('../../src/audit/audit.js');const A=global.MongoAudit;
let f=A.ledgerIdFindings([{id:'txn:1'},{id:'txn:1'}],['txn:1','transfer:2']);assert(f.some(x=>x.code==='duplicate-ledger-id'));assert(f.some(x=>x.code==='missing-ledger-id'&&x.id==='transfer:2'));
f=A.transferFindings([{id:'t1',fromId:'a',toId:'a',amount:10},{id:'t2',fromId:'a',toId:'b',amount:0}]);assert(f.some(x=>x.code==='transfer-same-account'));assert(f.some(x=>x.code==='transfer-nonpositive-amount'));
f=A.accountReferenceFindings([{id:'a'}],[{id:'x',fromAccountId:'a',toAccountId:'missing'}]);assert.deepStrictEqual(f.map(x=>x.code),['ledger-unknown-to-account']);
f=A.loanSplitFindings([{id:'lp',kind:'loan_payment',amount:120,principal:80,interest:20,extraPrincipal:0}]);assert.strictEqual(f.length,1);assert.strictEqual(f[0].code,'loan-payment-split-mismatch');
f=A.legacyLoanTxnFindings([{id:'tx',loanPaymentId:'p'}]);assert.strictEqual(f[0].severity,'warn');
f=A.savingsDoubleCountFindings([{id:'e',type:'expense',purpose:'savings',goalId:'g'}],[{purpose:'savings',targetId:'g',amount:100}]);assert.strictEqual(f[0].code,'savings-transfer-expense-double-count-signal');
const clean=A.run({accounts:[{id:'a'},{id:'b'}],ledger:[{id:'transfer:t',kind:'transfer',fromAccountId:'a',toAccountId:'b',amount:100}],expectedLedgerIds:['transfer:t'],transfers:[{id:'t',fromId:'a',toId:'b',amount:100}],txns:[]});assert.deepStrictEqual(clean,[]);console.log('Möngö audit regression tests: PASS');
