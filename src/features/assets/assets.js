// Möngö Assets — Phase 1A
// Pure asset/investment identity, aggregation and portfolio calculations.
(function(global){
'use strict';
const num=v=>Number(v)||0;
function normalizeName(v){return String(v||'').trim().toLocaleLowerCase();}
function groupKey(inv){return `${inv?.typeKey||'other'}:::${normalizeName(inv?.name)}`;}
function groupInvestments(items,options={}){const list=Array.isArray(items)?items:[],map=new Map();list.forEach((inv,i)=>{const key=groupKey(inv);if(!map.has(key))map.set(key,{key,name:inv?.name||'',typeKey:inv?.typeKey||'other',color:options.colorFor?options.colorFor(inv,i):inv?.color,items:[]});map.get(key).items.push(inv);});return [...map.values()].map(g=>({...g,invested:g.items.reduce((s,x)=>s+num(x?.invested),0),current:g.items.reduce((s,x)=>s+num(x?.current),0)}));}
function groupIncomeProducing(group){return !!(group&&Array.isArray(group.items)&&group.items.some(x=>!!x?.incomeProducing));}
function portfolioTotals(groups){const list=Array.isArray(groups)?groups:[],invested=list.reduce((s,g)=>s+num(g?.invested),0),current=list.reduce((s,g)=>s+num(g?.current),0),pnl=current-invested,pct=invested>0?pnl/invested*100:0;return {invested,current,pnl,pct};}
function groupPerformance(group){const invested=num(group?.invested),current=num(group?.current),pnl=current-invested,pct=invested>0?pnl/invested*100:0;return {invested,current,pnl,pct};}
global.MongoAssets=Object.freeze({normalizeName,groupKey,groupInvestments,groupIncomeProducing,portfolioTotals,groupPerformance});
})(window);
