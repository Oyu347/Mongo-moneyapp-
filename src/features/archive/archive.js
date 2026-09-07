// Möngö Completed Cards Archive — pure lifecycle/classification helpers.
(function(global){
'use strict';
const num=v=>Number(v)||0;
function goalCompleted(goal,effectiveSaved){const target=Math.max(0,num(goal?.target)),saved=Math.max(0,num(effectiveSaved==null?goal?.saved:effectiveSaved));return target>0&&saved>=target;}
function goalActive(goal,effectiveSaved){return !!goal&&!goalCompleted(goal,effectiveSaved)&&!goal.archivedAt;}
function debtCompleted(debt,effectiveRemaining){const rem=Math.max(0,num(effectiveRemaining==null?debt?.remaining:effectiveRemaining));return rem<=0.01&&Math.max(0,num(debt?.total))>0;}
function assetGroupArchived(group){const items=Array.isArray(group?.items)?group.items:[];return items.length>0&&items.every(x=>!!x?.archivedAt);}
function assetGroupSold(group){const items=Array.isArray(group?.items)?group.items:[];return items.length>0&&items.every(x=>!!x?.soldAt);}
function assetSaleBreakdown(costBasis,saleProceeds){const cost=Math.max(0,num(costBasis)),proceeds=Math.max(0,num(saleProceeds)),pnl=proceeds-cost;return {costBasis:cost,saleProceeds:proceeds,pnl,gain:Math.max(0,pnl),loss:Math.max(0,-pnl)};}
global.MongoArchive=Object.freeze({goalCompleted,goalActive,debtCompleted,assetGroupArchived,assetGroupSold,assetSaleBreakdown});
})(typeof window!=='undefined'?window:globalThis);
