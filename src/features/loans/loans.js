// Möngö Loans — Phase 1A
// Pure loan calculations only. UI, persistence, account movement and linked asset/transaction effects stay outside.
(function(global){
'use strict';
const num=v=>Number(v)||0;
function payments(debt){return Array.isArray(debt?.payments)?debt.payments:[];}
function principalPaid(debt){return payments(debt).reduce((s,p)=>s+num(p.principal)+num(p.extraPrincipal),0);}
function totalPaid(debt){return payments(debt).reduce((s,p)=>s+num(p.total),0);}
function interestPaid(debt){return payments(debt).reduce((s,p)=>s+num(p.interest),0);}
function openingRemaining(debt){if(!debt)return 0;const open=Number(debt.openingRemaining);if(Number.isFinite(open)&&open>=0)return open;const rem=Number(debt.remaining);if(Number.isFinite(rem)&&rem>=0)return rem;return Math.max(0,num(debt.total));}
function remaining(debt,legacyPrincipalPaid=0){return Math.max(0,openingRemaining(debt)-principalPaid(debt)-Math.max(0,num(legacyPrincipalPaid)));}
function nextSplit(debt,balance){
 const bal=Math.max(0,balance==null?remaining(debt):num(balance)),months=Math.max(1,num(debt?.termMonths)||1),rate=Math.max(0,num(debt?.rate)),r=rate/12/100;
 const paidCount=payments(debt).length,remainMonths=Math.max(1,months-paidCount);let interest=bal*r,principal=0,total=0;
 if((debt?.paymentType||'annuity')==='diff'){const fixed=(num(debt?.total)||bal)/months;principal=Math.min(bal,fixed);total=principal+interest;}
 else{const pay=r===0?bal/remainMonths:bal*(r*Math.pow(1+r,remainMonths))/(Math.pow(1+r,remainMonths)-1);total=Math.min(bal+interest,pay);principal=Math.max(0,total-interest);}
 return {total,principal,interest};
}
function buildSchedule(P,annualRate,months,type,extra,extraMonths){
 P=Math.max(0,num(P));annualRate=Math.max(0,num(annualRate));months=Math.max(0,Math.trunc(num(months)));extra=Math.max(0,num(extra));extraMonths=Math.max(0,Math.trunc(num(extraMonths)));
 const schedule=[];let bal=P;const r=annualRate/12/100;let totalInterest=0;const fixedPrincipal=months>0?P/months:0;const annPay=r===0?(months?P/months:0):P*(r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1);let guard=0;
 while(bal>0.01&&guard<1000){guard++;const activeExtra=extra>0&&(!extraMonths||guard<=extraMonths)?extra:0;const interest=bal*r;let principal,payment;
  if(type==='diff'){principal=Math.min(fixedPrincipal+activeExtra,bal);payment=principal+interest;}
  else{payment=annPay+activeExtra;principal=payment-interest;if(principal<=0)principal=Math.min(bal,payment);if(principal>bal){principal=bal;payment=principal+interest;}}
  bal=Math.max(0,bal-principal);totalInterest+=interest;schedule.push({m:guard,payment,interest,principal,balance:bal});if(type==='annuity'&&annPay+(extra>0&&(!extraMonths||guard<=extraMonths)?extra:0)<=interest&&r>0)break;
 }
 return {schedule,totalInterest,totalPay:P+totalInterest,monthly:type==='diff'?(schedule[0]?.payment||0):annPay};
}
global.MongoLoans=Object.freeze({payments,principalPaid,totalPaid,interestPaid,openingRemaining,remaining,nextSplit,buildSchedule});
})(window);
