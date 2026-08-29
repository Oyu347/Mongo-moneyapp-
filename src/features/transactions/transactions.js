// Möngö Transactions — Phase 1 COMPLETE
// Pure compatibility helpers for ordinary transaction/transfer construction, editing, filtering and safe removal.
// Ledger semantics stay in MongoLedgerCore; UI/persistence and loan/savings/investment/asset/PYF business rules stay outside.
(function(global){
'use strict';
const num=v=>Number(v)||0;
const clean=v=>String(v==null?'':v).trim();
function makeId(prefix,uuid,now){return uuid||prefix+'_'+String(now||Date.now())+'_'+Math.random().toString(36).slice(2,9);}
function makeTransaction(input,options={}){
 const s=input||{}, amount=num(s.amount), type=s.type==='income'?'income':'expense';
 if(!(amount>0))return {ok:false,reason:'amount_required'};
 if(!s.accountId)return {ok:false,reason:'account_required'};
 const desc=clean(s.desc)||clean(s.subcatName)||clean(s.catName);
 const txn={id:s.id||makeId('txn',options.uuid,options.now),desc,amount,catName:s.catName||'',catKey:s.catKey||null,subcatKey:s.subcatKey||null,subcatName:s.subcatName||null,investTypeKey:s.investTypeKey||null,date:s.date||options.fallbackDate||new Date().toISOString().slice(0,10),type,accountId:s.accountId,updatedAt:options.timestamp||new Date().toISOString()};
 if(s.createdAt!=null)txn.createdAt=s.createdAt;
 return {ok:true,txn};
}
function applyEdit(txn,patch,options={}){
 if(!txn)return {ok:false,reason:'not_found'};
 const made=makeTransaction(Object.assign({},txn,patch,{id:txn.id}),options); if(!made.ok)return made;
 const id=txn.id,createdAt=txn.createdAt;Object.assign(txn,made.txn,{id});if(createdAt!=null)txn.createdAt=createdAt;return {ok:true,txn};
}
function makeTransfer(input,options={}){
 const s=input||{}, amount=num(s.amount), purpose=s.purpose||'internal';
 if(!(amount>0))return {ok:false,reason:'amount_required'};
 if(!s.fromId)return {ok:false,reason:'source_required'};
 if(purpose!=='asset'&&(!s.toId||String(s.fromId)===String(s.toId)))return {ok:false,reason:'destination_required'};
 return {ok:true,transfer:{id:s.id||makeId('tr',options.uuid,options.now),fromId:s.fromId,toId:purpose==='asset'?null:s.toId,amount,date:s.date||options.fallbackDate||new Date().toISOString().slice(0,10),purpose,targetId:s.targetId||null,updatedAt:options.timestamp||new Date().toISOString()}};
}
function makeInternalTransfer(input,options={}){return makeTransfer(Object.assign({},input,{purpose:'internal'}),options);}
function removeById(items,id){return (Array.isArray(items)?items:[]).filter(x=>String(x?.id)!==String(id));}
function removalPreview(items,id){const list=Array.isArray(items)?items:[],item=list.find(x=>String(x?.id)===String(id));return item?{ok:true,item,items:removeById(list,id)}:{ok:false,reason:'not_found',items:list.slice()};}
function periodRange(period,now){
 if(period==='all')return {from:new Date(0),to:new Date(8640000000000000)};
 const to=new Date(now||Date.now());to.setHours(23,59,59,999);const from=new Date(to);
 if(period==='7d')from.setDate(from.getDate()-7);else if(period==='1m')from.setMonth(from.getMonth()-1);else if(period==='3m')from.setMonth(from.getMonth()-3);else if(period==='1y')from.setFullYear(from.getFullYear()-1);
 from.setHours(0,0,0,0);return {from,to};
}
function inPeriod(obj,period,parseDate,now){const r=periodRange(period,now),d=parseDate?parseDate(obj?.date):new Date(obj?.date);return d>=r.from&&d<=r.to;}
function filterByAccount(items,accountId){return (Array.isArray(items)?items:[]).filter(t=>accountId==='all'||!accountId||String(t?.accountId)===String(accountId));}
function summarize(items,transfers,accountId){
 const list=Array.isArray(items)?items:[],trs=Array.isArray(transfers)?transfers:[];
 const income=list.filter(t=>t?.type==='income').reduce((s,t)=>s+num(t.amount),0),expense=list.filter(t=>t?.type==='expense').reduce((s,t)=>s+num(t.amount),0);
 let transferIn=0,transferOut=0;trs.forEach(t=>{const a=num(t.amount);if(accountId==='all'||!accountId){transferIn+=a;transferOut+=a;}else{if(String(t.toId)===String(accountId))transferIn+=a;if(String(t.fromId)===String(accountId))transferOut+=a;}});
 return {income,expense,transferIn,transferOut};
}
global.MongoTransactions=Object.freeze({makeTransaction,applyEdit,makeTransfer,makeInternalTransfer,removeById,removalPreview,periodRange,inPeriod,filterByAccount,summarize});
})(window);
