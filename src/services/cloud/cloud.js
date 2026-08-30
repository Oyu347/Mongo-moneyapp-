// Möngö Cloud — Phase 1B
// Pure cloud/local ordering, clear-barrier and stale queue decisions. No Firebase, storage or UI side effects.
(function(global){
'use strict';
function stamp(v){const n=Date.parse(v||'');return Number.isFinite(n)?n:0;}
function chooseCloudOrLocal(input){const x=input||{},local=x.local||{},cloud=x.cloud||{},localHas=!!x.localHas,cloudHas=!!x.cloudHas;if(cloudHas&&!localHas)return {winner:'cloud',source:'cloud'};if(localHas&&!cloudHas)return {winner:'local',source:'local-migrate'};if(!localHas&&!cloudHas)return {winner:'cloud',source:'cloud-empty'};const localTime=stamp(local.clientUpdatedAt||x.localUpdatedAt),cloudTime=stamp(cloud.clientUpdatedAt||x.cloudUpdatedAt);if(localTime&&cloudTime&&localTime>cloudTime)return {winner:'local',source:'local-newer'};return {winner:'cloud',source:'cloud'};}
function candidateTime(candidate){const raw=candidate&&candidate.raw||{};return stamp(raw.updatedAtClient||(raw.data&&raw.data.clientUpdatedAt));}
function sortNewestCandidates(candidates){return [...(Array.isArray(candidates)?candidates:[])].sort((a,b)=>candidateTime(b)-candidateTime(a));}
function chooseClearBarrier(input){const x=input||{},barrier=x.barrier||null;if(!barrier||!barrier.data)return {useBarrier:false};const barrierTime=stamp(barrier.clearedAt),localTime=stamp(x.localUpdatedAt),cloudTime=stamp(x.newestCloudUpdatedAt);return {useBarrier:!!barrierTime&&barrierTime>=localTime&&barrierTime>=cloudTime,barrierTime,localTime,cloudTime};}
function queueItemAllowedAfterClear(item,barrier){if(!barrier||!barrier.clearedAt)return true;if(item&&item.reason==='clear-tombstone')return true;return stamp(item&&item.createdAt)>stamp(barrier.clearedAt);}
function filterQueueAfterClear(queue,barrier){return (Array.isArray(queue)?queue:[]).filter(item=>queueItemAllowedAfterClear(item,barrier));}
function queueChangedByBarrier(queue,barrier){const before=Array.isArray(queue)?queue:[],after=filterQueueAfterClear(before,barrier);return {queue:after,removed:before.length-after.length,changed:after.length!==before.length};}
global.MongoCloud=Object.freeze({stamp,chooseCloudOrLocal,candidateTime,sortNewestCandidates,chooseClearBarrier,queueItemAllowedAfterClear,filterQueueAfterClear,queueChangedByBarrier});
})(window);
