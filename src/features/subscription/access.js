// Möngö Subscription/Trial access — Phase 1A
// Pure compatibility extraction from the V43.14–V43.20 inline trial/paywall policy.
(function(global){
'use strict';
const TRIAL_DAYS=7;
function trialInfo(state,overrideDay){
  if(!state)return {day:null,remaining:null,isExpired:false,isPaid:false,status:'unknown'};
  const isPaid=state.subscriptionStatus==='active'||!!state.subscriptionStartDate;
  const override=Number.isInteger(overrideDay)&&overrideDay>=1&&overrideDay<=30?overrideDay:null;
  const day=Math.max(1,override||Number(state.trialDay||1));
  return {day,remaining:Math.max(0,TRIAL_DAYS-day),isExpired:!isPaid&&day>TRIAL_DAYS,isPaid,status:isPaid?'active':(day>TRIAL_DAYS?'expired':'trial')};
}
function isReadOnly(state,overrideDay){const info=trialInfo(state,overrideDay);return !!(info&&info.isExpired&&!info.isPaid);}
function reminderDay(state,overrideDay){const info=trialInfo(state,overrideDay);return !info.isPaid&&!info.isExpired&&[5,6,7].includes(info.day)?info.day:null;}
function classifyTarget(input){
  const x=input||{},text=String(x.text||'').trim().toLowerCase(),idcls=String(x.idClass||'').toLowerCase();
  const exactLoan=['зээл','loan','loans','debt'];
  if(x.freeAfterTrial==='loan-nav'||exactLoan.includes(text)||['nav-loan','loan-nav','nav-debt','debt-nav','tab-loan-main','loan-menu'].some(k=>idcls.includes(k)))return 'loan-free';
  const calc=text==='тооцоолуур'||text==='calculator'||text.includes('зээлийн тооцоолуур')||text.includes('loan calculator')||idcls.includes('calculator')||idcls.includes('calc');
  const context=String(x.context||'').toLowerCase();
  if(calc&&(text.includes('зээл')||text.includes('loan')||idcls.includes('loan')||idcls.includes('debt')||context.includes('loan')||context.includes('debt')))return 'loan-free';
  if(x.insideLoanCalculator)return 'loan-free';
  if(calc&&(context.includes('хуримтлал')||context.includes('saving')||context.includes('хөрөнгө')||context.includes('investment')||context.includes('asset')))return 'premium-calculator';
  if(x.writeAction)return 'write';
  return 'view';
}
function accessDecision(state,target,overrideDay){
  if(!isReadOnly(state,overrideDay))return {allowed:true,reason:'active'};
  const kind=classifyTarget(target);
  if(kind==='loan-free'||kind==='view')return {allowed:true,reason:kind};
  return {allowed:false,reason:kind};
}
global.MongoSubscription=Object.freeze({TRIAL_DAYS,trialInfo,isReadOnly,reminderDay,classifyTarget,accessDecision});
})(window);
