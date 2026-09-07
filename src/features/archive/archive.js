// Möngö Completed Cards Archive — pure lifecycle/classification helpers.
(function(global){
'use strict';
const num=v=>Number(v)||0;
function goalCompleted(goal,effectiveSaved){const target=Math.max(0,num(goal?.target)),saved=Math.max(0,num(effectiveSaved==null?goal?.saved:effectiveSaved));return target>0&&saved>=target;}
function goalArchived(goal,effectiveSaved){return !!goal&&(!!goal.archivedAt||goalCompleted(goal,effectiveSaved));}
function goalActive(goal,effectiveSaved){return !!goal&&!goalArchived(goal,effectiveSaved);}
function debtCompleted(debt,effectiveRemaining){const rem=Math.max(0,num(effectiveRemaining==null?debt?.remaining:effectiveRemaining));return rem<=0.01&&Math.max(0,num(debt?.total))>0;}
function assetGroupArchived(group){const items=Array.isArray(group?.items)?group.items:[];return items.length>0&&items.every(x=>!!x?.archivedAt);}
function assetGroupSold(group){const items=Array.isArray(group?.items)?group.items:[];return items.length>0&&items.every(x=>!!x?.soldAt);}
function assetSaleBreakdown(costBasis,saleProceeds){const cost=Math.max(0,num(costBasis)),proceeds=Math.max(0,num(saleProceeds)),pnl=proceeds-cost;return {costBasis:cost,saleProceeds:proceeds,pnl,gain:Math.max(0,pnl),loss:Math.max(0,-pnl)};}
function savingsUndoPlan(transfers,goalId,savingsAccountId){const rows=(Array.isArray(transfers)?transfers:[]).filter(t=>String(t?.goalId||t?.linkedGoalId||'')===String(goalId)&&String(t?.to||t?.toAccountId||'')===String(savingsAccountId)&&!t?.reversedAt);const bySource={};let total=0;for(const t of rows){const source=String(t?.from||t?.fromAccountId||'');const amount=Math.max(0,num(t?.amount));if(!source||!amount)continue;bySource[source]=(bySource[source]||0)+amount;total+=amount;}return {transferIds:rows.map(t=>t.id).filter(Boolean),bySource,total};}
global.MongoArchive=Object.freeze({goalCompleted,goalArchived,goalActive,debtCompleted,assetGroupArchived,assetGroupSold,assetSaleBreakdown,savingsUndoPlan});
})(typeof window!=='undefined'?window:globalThis);
