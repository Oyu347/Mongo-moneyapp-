// Möngö Budget — Phase 1 COMPLETE
// Pure budget keys, Transfer-backed actuals, planning-source normalization and legacy source migration.
(function(global){
'use strict';
const num=v=>Number(v)||0;
function categoryKey(cat){return cat?.key||cat?.name||'';}
function subcategoryKey(cat,sub){return categoryKey(cat)+':::'+(sub?.key||sub?.name||'');}
function yearMonthKey(budgetKey,month,year){return `${year}_${month}_${budgetKey}`;}
function getValue(budgets,budgetKey,month,year,currentYear){const map=budgets||{},ymk=yearMonthKey(budgetKey,month,year);if(map[ymk]!==undefined)return map[ymk];if(year===currentYear&&map[budgetKey]&&typeof map[budgetKey]==='object')return map[budgetKey][month]||0;return 0;}
function rowInMonth(row,month,year){const p=String(row?.date||'').split('-');return Number(p[0])===Number(year)&&Number(p[1])===Number(month);}
function sumRows(rows,predicate){return (Array.isArray(rows)?rows:[]).filter(predicate||(()=>true)).reduce((s,x)=>s+num(x?.amount),0);}
function savingsGoalActual(transfers,txns,goalId,month,year){const moved=sumRows(transfers,t=>t?.purpose==='savings'&&String(t.targetId)===String(goalId)&&rowInMonth(t,month,year));const interest=sumRows(txns,t=>t?.type==='income'&&t?.incomePurpose==='savings_interest'&&String(t.goalId)===String(goalId)&&rowInMonth(t,month,year));return moved+interest;}
function investmentActual(transfers,keys,month,year){const eligible=new Set((keys||[]).map(String));return sumRows(transfers,t=>(t?.purpose==='investment'||t?.purpose==='asset')&&rowInMonth(t,month,year)&&(eligible.has(String(t.targetId))||eligible.has(String(t.assetId))));}
function loanActual(payments,month,year){return (Array.isArray(payments)?payments:[]).filter(p=>rowInMonth(p,month,year)).reduce((s,p)=>s+num(p?.total),0);}
function progress(plan,actual,isIncomePlan){const p=num(plan),a=num(actual),pct=p?a/p*100:0;let health='good';if(!isIncomePlan&&pct>100)health='bad';else if((isIncomePlan&&pct<80)||(!isIncomePlan&&pct>=80))health='warn';return {plan:p,actual:a,pct,health};}
function sourceKey(kind,id){return String(kind||'')+'_'+String(id);}
function sourceNames(name){const v=String(name||'');return {mn:v,en:v,zh:v,ja:v,ko:v,ru:v,de:v};}
function sourceDescriptor(kind,id,name,color,extra){return {key:sourceKey(kind,id),names:sourceNames(name),color,...(extra||{})};}
function selectedPeriodIsCurrentOrFuture(year,month,now){const d=now instanceof Date?now:new Date(now||Date.now());return Number(year)>d.getFullYear()||(Number(year)===d.getFullYear()&&Number(month)>=d.getMonth()+1);}
function canSeedBudget(budgets,key,value,year,month,now){return selectedPeriodIsCurrentOrFuture(year,month,now)&&num(value)>0&&!Object.prototype.hasOwnProperty.call(budgets||{},key);}
function investmentSourceEligible(group,recurringTypes=['stock','bond','fund','crypto','gold']){if(!group||!new Set(recurringTypes.map(String)).has(String(group.typeKey||'')))return false;return !(group.items||[]).some(item=>item?.loanFunded===true||item?.linkedDebtId!=null);}
function isLinkedSourceKey(key){return /^(goal|debt|invest)_/.test(String(key||''));}
function findLegacySource(subs,name,normalizeName,getName){const norm=typeof normalizeName==='function'?normalizeName:v=>String(v||'').trim().toLowerCase(),label=typeof getName==='function'?getName:s=>s?.name||'';return (subs||[]).find(s=>!isLinkedSourceKey(s?.key)&&norm(label(s))===norm(name))||null;}
function migrateBudgetSuffixes(budgets,oldSuffix,newSuffix){const map=budgets||{},moves=[];Object.keys(map).forEach(k=>{if(k.endsWith(oldSuffix)&&map[k]!==undefined){const nk=k.slice(0,k.length-oldSuffix.length)+newSuffix;if(map[nk]===undefined)moves.push({from:k,to:nk,value:map[k]});}});return moves;}
function applyBudgetMoves(budgets,moves){(moves||[]).forEach(m=>{if(!Object.prototype.hasOwnProperty.call(budgets,m.to))budgets[m.to]=m.value;});return budgets;}
global.MongoBudget=Object.freeze({categoryKey,subcategoryKey,yearMonthKey,getValue,rowInMonth,sumRows,savingsGoalActual,investmentActual,loanActual,progress,sourceKey,sourceNames,sourceDescriptor,selectedPeriodIsCurrentOrFuture,canSeedBudget,investmentSourceEligible,isLinkedSourceKey,findLegacySource,migrateBudgetSuffixes,applyBudgetMoves});
})(window);
