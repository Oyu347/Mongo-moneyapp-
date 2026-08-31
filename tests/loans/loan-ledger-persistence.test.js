'use strict';
const assert=require('assert');
global.window=global;
require('../../src/core/ledger.js');
const L=global.MongoLedgerCore;

const accounts=[
  {id:'khan',openingBalance:250000,active:true,type:'checking'},
  {id:'khas',openingBalance:100000,active:true,type:'checking'}
];
const debt={
  id:'loan-home',name:'Байрны зээл',total:150000000,openingRemaining:150000000,
  fundingMode:'existing',fundingAccountId:'khan',fundingAmount:150000000,
  startDate:'2026-08-31',payments:[{
    id:'pay-1',date:'2026-08-31',accountId:'khan',total:50000,
    principal:40000,interest:10000,extraPrincipal:0,createdAt:'2026-08-31T01:50:00.000Z'
  }]
};
const assetTransfer={id:'asset-1',fromId:'khan',toId:null,amount:45000000,date:'2026-08-31',purpose:'asset',targetId:'land'};
const state={txns:[],accountTransfers:[assetTransfer],debts:[debt]};

// A stale/incomplete ledger must be detectable BEFORE any projection back to debt views.
const stale=L.buildLedger({txns:[],accountTransfers:[assetTransfer],debts:[]},[],'2026-08-31T02:00:00.000Z');
assert.strictEqual(L.needsRebuild(state,stale),true,'stale ledger must not be treated as authoritative when loan rows are missing');

// Rebuilding from source views must preserve loan proceeds, repayment and later asset movement together.
const ledger=L.buildLedger(state,stale,'2026-08-31T02:01:00.000Z');
const ids=new Set(ledger.map(x=>x.id));
assert(ids.has('loan-received:loan-home'),'loan proceeds must remain in unified ledger');
assert(ids.has('loan-payment:pay-1'),'loan repayment must remain in unified ledger');
assert(ids.has('transfer:asset-1'),'subsequent asset purchase must remain in unified ledger');
assert.strictEqual(L.needsRebuild(state,ledger),false);
assert.deepStrictEqual(L.validateLedger(ledger),[]);

const received=ledger.find(x=>x.id==='loan-received:loan-home');
const paid=ledger.find(x=>x.id==='loan-payment:pay-1');
assert.strictEqual(received.toAccountId,'khan');
assert.strictEqual(received.amount,150000000);
assert.strictEqual(paid.fromAccountId,'khan');
assert.strictEqual(paid.amount,50000);
assert.strictEqual(paid.principal,40000);
assert.strictEqual(paid.interest,10000);

// Account reconciliation: opening + loan proceeds - repayment - asset purchase.
assert.strictEqual(L.accountBalance('khan',accounts,ledger),105200000);

console.log('Möngö loan ledger persistence regression: PASS');
