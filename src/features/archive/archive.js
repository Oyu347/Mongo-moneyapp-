// Möngö Completed Cards Archive — pure classification helpers.
(function(global){
'use strict';
const num=v=>Number(v)||0;
function goalCompleted(goal,effectiveSaved){const target=Math.max(0,num(goal?.target)),saved=Math.max(0,num(effectiveSaved==null?goal?.saved:effectiveSaved));return target>0&&saved>=target;}
function debtCompleted(debt,effectiveRemaining){const rem=Math.max(0,num(effectiveRemaining==null?debt?.remaining:effectiveRemaining));return rem<=0.01&&Math.max(0,num(debt?.total))>0;}
function assetGroupArchived(group){const items=Array.isArray(group?.items)?group.items:[];return items.length>0&&items.every(x=>!!x?.archivedAt);}
global.MongoArchive=Object.freeze({goalCompleted,debtCompleted,assetGroupArchived});
})(typeof window!=='undefined'?window:globalThis);
