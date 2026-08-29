// Run with: node tests/core/ledger-parity.test.js
'use strict';

const assert = require('assert');
global.window = global;
require('../../src/core/ledger.js');
const L = global.MongoLedgerCore;
const FIXED_NOW = '2026-08-29T00:00:00.000Z';

// Frozen reference implementation copied from the current V44 inline unified-ledger logic.
const cleanId = v => String(v ?? '');
const clone = v => JSON.parse(JSON.stringify(v));
function oldTxnKind(t){if(t.assetIncome)return'asset_income';if(t.savingsInterest)return'savings_interest';return t.type==='income'?'income':'expense';}
function oldTransferKind(t){return t.purpose==='savings'?'savings_transfer':t.purpose==='investment'?'investment_contribution':t.purpose==='asset'?'asset_purchase':'transfer';}
function oldTxn(t,old){return{id:`txn:${cleanId(t.id)}`,kind:oldTxnKind(t),amount:Number(t.amount)||0,date:t.date,fromAccountId:t.type==='expense'?cleanId(t.accountId):'',toAccountId:t.type==='income'?cleanId(t.accountId):'',categoryKey:t.catKey||'',subcategoryKey:t.subcatKey||t.subcatName||'',description:t.desc||'',assetId:t.assetGroupKey||'',goalId:t.goalId||'',sourceId:cleanId(t.id),data:clone(t),createdAt:old?.createdAt||t.createdAt||FIXED_NOW,updatedAt:t.updatedAt||FIXED_NOW};}
function oldTransfer(t,old){return{id:`transfer:${cleanId(t.id)}`,kind:oldTransferKind(t),amount:Number(t.amount)||0,date:t.date,fromAccountId:cleanId(t.fromId),toAccountId:cleanId(t.toId),goalId:t.purpose==='savings'?cleanId(t.targetId):'',assetId:(t.purpose==='asset'||t.purpose==='investment')?cleanId(t.targetId||t.assetId):'',sourceId:cleanId(t.id),data:clone(t),createdAt:old?.createdAt||t.createdAt||t.updatedAt||FIXED_NOW,updatedAt:t.updatedAt||FIXED_NOW};}
function oldFunding(d,old){return{id:`loan-received:${cleanId(d.id)}`,kind:'loan_received',amount:Number(d.fundingAmount)||0,date:d.startDate||String(d.createdAt||'').slice(0,10),toAccountId:cleanId(d.fundingAccountId),loanId:cleanId(d.id),description:d.name||'',sourceId:cleanId(d.id),createdAt:old?.createdAt||d.createdAt||FIXED_NOW,updatedAt:d.updatedAt||FIXED_NOW};}
function oldPayment(d,p,old){return{id:`loan-payment:${cleanId(p.id)}`,kind:'loan_payment',amount:Number(p.total)||0,date:p.date,fromAccountId:cleanId(p.accountId),loanId:cleanId(d.id),description:d.name||'',sourceId:cleanId(p.id),principal:Number(p.principal)||0,interest:Number(p.interest)||0,extraPrincipal:Number(p.extraPrincipal)||0,createdAt:old?.createdAt||p.createdAt||FIXED_NOW,updatedAt:p.updatedAt||FIXED_NOW};}
function oldBuild(state,previousLedger){const previous=new Map((previousLedger||[]).map(e=>[cleanId(e.id),e])),next=[];(state.txns||[]).filter(t=>t&&!t.loanPaymentId&&(t.type==='income'||t.type==='expense')).forEach(t=>next.push(oldTxn(t,previous.get(`txn:${cleanId(t.id)}`))));(state.accountTransfers||[]).forEach(t=>next.push(oldTransfer(t,previous.get(`transfer:${cleanId(t.id)}`))));(state.debts||[]).forEach(d=>{if(d.fundingMode==='existing'&&Number(d.fundingAmount)>0&&d.fundingAccountId)next.push(oldFunding(d,previous.get(`loan-received:${cleanId(d.id)}`)));(Array.isArray(d.payments)?d.payments:[]).forEach(p=>next.push(oldPayment(d,p,previous.get(`loan-payment:${cleanId(p.id)}`))));});return next.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||String(b.createdAt||'').localeCompare(String(a.createdAt||'')));}
function oldBalance(accountId,accounts,ledger){const id=cleanId(accountId),a=(accounts||[]).find(x=>cleanId(x.id)===id);if(!a)return 0;let value=Number(a.openingBalance)||0;(ledger||[]).forEach(e=>{const amount=Number(e.amount)||0;if(cleanId(e.fromAccountId)===id)value-=amount;if(cleanId(e.toAccountId)===id)value+=amount;});return value;}

const state={
  txns:[
    {id:'i1',type:'income',amount:50000,accountId:'bank',date:'2026-08-01',catKey:'salary'},
    {id:'e1',type:'expense',amount:12000,accountId:'cash',date:'2026-08-02',subcatName:'food'},
    {id:'ai1',type:'income',amount:8000,accountId:'bank',date:'2026-08-03',assetIncome:true,assetGroupKey:'asset1'},
    {id:'si1',type:'income',amount:1000,accountId:'savings',date:'2026-08-04',savingsInterest:true},
    {id:'legacy-loan-interest',type:'expense',amount:999,accountId:'bank',date:'2026-08-04',loanPaymentId:'pay-old'}
  ],
  accountTransfers:[
    {id:'t1',amount:10000,fromId:'bank',toId:'cash',date:'2026-08-05'},
    {id:'s1',amount:15000,fromId:'bank',toId:'savings',date:'2026-08-06',purpose:'savings',targetId:'goal1'},
    {id:'inv1',amount:7000,fromId:'bank',toId:'invest',date:'2026-08-07',purpose:'investment',targetId:'stock1'},
    {id:'asset1',amount:9000,fromId:'bank',toId:'asset',date:'2026-08-08',purpose:'asset',targetId:'car1'}
  ],
  debts:[{id:'loan1',name:'Loan',fundingMode:'existing',fundingAmount:40000,fundingAccountId:'bank',startDate:'2026-08-09',payments:[{id:'p1',accountId:'bank',date:'2026-08-10',total:12000,principal:9000,interest:2000,extraPrincipal:1000}]}]
};
const accounts=[{id:'bank',openingBalance:100000},{id:'cash',openingBalance:20000},{id:'savings',openingBalance:0},{id:'invest',openingBalance:0},{id:'asset',openingBalance:0}];
const previous=[{id:'txn:i1',createdAt:'2026-01-01T00:00:00.000Z'}];

const oldLedger=oldBuild(state,previous);
const newLedger=L.buildLedger(state,previous,FIXED_NOW);
assert.deepStrictEqual(newLedger,oldLedger,'new core ledger must exactly match frozen V44 reference output');
accounts.forEach(a=>assert.strictEqual(L.accountBalance(a.id,accounts,newLedger),oldBalance(a.id,accounts,oldLedger),`balance parity: ${a.id}`));
assert.strictEqual(newLedger.some(e=>e.sourceId==='legacy-loan-interest'),false,'legacy loan-payment expense must be excluded');
assert.strictEqual(newLedger.filter(e=>e.kind==='loan_payment').length,1,'one loan payment ledger entry');
assert.strictEqual(newLedger.find(e=>e.kind==='loan_payment').interest,2000,'interest remains a split, not duplicate expense');
console.log('Möngö ledger old/new parity tests: PASS');
