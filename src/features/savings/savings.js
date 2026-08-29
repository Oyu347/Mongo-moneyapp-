// Möngö Savings — Phase 1B
// Pure goal/savings calculations and savings-account metadata normalization. Transfers remain movements, not expenses.
(function(global){
'use strict';
const num=v=>Number(v)||0,MODES=new Set(['compound','payout','maturity','none']),FREQUENCIES=new Set(['monthly','quarterly','yearly','maturity']);
function transferContribution(goal,transfers){return (Array.isArray(transfers)?transfers:[]).filter(t=>t?.purpose==='savings'&&String(t.targetId)===String(goal?.id)).reduce((s,t)=>s+num(t.amount),0);}
function interestContribution(goal,txns){return (Array.isArray(txns)?txns:[]).filter(t=>t?.type==='income'&&t.incomePurpose==='savings_interest'&&String(t.goalId)===String(goal?.id)).reduce((s,t)=>s+num(t.amount),0);}
function autoSaved(goal,transfers,txns){return transferContribution(goal,transfers)+interestContribution(goal,txns);}
function effectiveSaved(goal,transfers,txns){return Math.max(0,num(goal?.saved))+autoSaved(goal,transfers,txns);}
function progressPct(goal,transfers,txns){const target=Math.max(0,num(goal?.target)),saved=Math.max(0,effectiveSaved(goal,transfers,txns));return target>0?Math.max(0,Math.min(100,Math.round(saved/target*100))):0;}
function addMonthsSafe(date,months){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12,0,0,0),day=d.getDate();d.setMonth(d.getMonth()+months);if(d.getDate()<day)d.setDate(0);return d;}
function monthsBetweenCeil(from,to){const start=new Date(from.getFullYear(),from.getMonth(),from.getDate(),12,0,0,0),end=new Date(to.getFullYear(),to.getMonth(),to.getDate(),12,0,0,0);if(end<=start)return 0;let months=(end.getFullYear()-start.getFullYear())*12+(end.getMonth()-start.getMonth());if(addMonthsSafe(start,months)<end)months++;return Math.max(0,months);}
function calendarMonthsDaysBetween(from,to){const start=new Date(from.getFullYear(),from.getMonth(),from.getDate(),12,0,0,0),end=new Date(to.getFullYear(),to.getMonth(),to.getDate(),12,0,0,0);if(end<=start)return {months:0,days:0};let months=(end.getFullYear()-start.getFullYear())*12+(end.getMonth()-start.getMonth()),anchor=addMonthsSafe(start,months);if(anchor>end){months=Math.max(0,months-1);anchor=addMonthsSafe(start,months);}return {months,days:Math.max(0,Math.round((end-anchor)/86400000))};}
function normalizeInterestMetadata(input){const x=input||{},mode=MODES.has(x.interestMode)?x.interestMode:'compound',frequency=FREQUENCIES.has(x.interestFrequency)?x.interestFrequency:'monthly';return {interestMode:mode,annualInterestRate:Math.max(0,num(x.annualInterestRate)),interestFrequency:frequency,interestAccountId:x.interestAccountId||null,linkedGoalId:x.linkedGoalId||null,maturityDate:x.maturityDate||''};}
function interestDestination(account,defaultAccountId){if(!account||account.interestMode==='none')return null;return account.interestMode==='payout'?(account.interestAccountId||defaultAccountId||null):(account.id||null);}
function linkedGoalId(account){return account?.linkedGoalId||account?.goalId||null;}
global.MongoSavings=Object.freeze({transferContribution,interestContribution,autoSaved,effectiveSaved,progressPct,addMonthsSafe,monthsBetweenCeil,calendarMonthsDaysBetween,normalizeInterestMetadata,interestDestination,linkedGoalId});
})(window);
