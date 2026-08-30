// Möngö Budget — Phase 1A
// Pure budget keys, legacy-compatible lookup, month matching and progress classification.
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
global.MongoBudget=Object.freeze({categoryKey,subcategoryKey,yearMonthKey,getValue,rowInMonth,sumRows,savingsGoalActual,investmentActual,loanActual,progress});
})(window);
