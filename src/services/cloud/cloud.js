// Möngö Cloud — Phase 1C
// Pure cloud/local ordering, reset queue protection and write/mirror policy. No Firebase/storage/UI side effects.
(function(global){
'use strict';
const MIRROR_REASONS=Object.freeze(['force','login-mirror','legacy-path-migration','first-cloud-migration','bootstrap-mirror','clear-tombstone']);
function stamp(v){const n=Date.parse(v||'');return Number.isFinite(n)?n:0;}
function chooseCloudOrLocal(input){const x=input||{},local=x.local||{},cloud=x.cloud||{},localHas=!!x.localHas,cloudHas=!!x.cloudHas;if(cloudHas&&!localHas)return {winner:'cloud',source:'cloud'};if(localHas&&!cloudHas)return {winner:'local',source:'local-migrate'};if(!localHas&&!cloudHas)return {winner:'cloud',source:'cloud-empty'};const localTime=stamp(local.clientUpdatedAt||x.localUpdatedAt),cloudTime=stamp(cloud.clientUpdatedAt||x.cloudUpdatedAt);if(localTime&&cloudTime&&localTime>cloudTime)return {winner:'local',source:'local-newer'};return {winner:'cloud',source:'cloud'};}
function candidateTime(candidate){const raw=candidate&&candidate.raw||{};return stamp(raw.updatedAtClient||(raw.data&&raw.data.clientUpdatedAt));}
function sortNewestCandidates(candidates){return [...(Array.isArray(candidates)?candidates:[])].sort((a,b)=>candidateTime(b)-candidateTime(a));}
function chooseClearBarrier(input){const x=input||{},barrier=x.barrier||null;if(!barrier||!barrier.data)return {useBarrier:false};const barrierTime=stamp(barrier.clearedAt),localTime=stamp(x.localUpdatedAt),cloudTime=stamp(x.newestCloudUpdatedAt);return {useBarrier:!!barrierTime&&barrierTime>=localTime&&barrierTime>=cloudTime,barrierTime,localTime,cloudTime};}
function queueItemAllowedAfterClear(item,barrier){if(!barrier||!barrier.clearedAt)return true;if(item&&item.reason==='clear-tombstone')return true;return stamp(item&&item.createdAt)>stamp(barrier.clearedAt);}
function filterQueueAfterClear(queue,barrier){return (Array.isArray(queue)?queue:[]).filter(item=>queueItemAllowedAfterClear(item,barrier));}
function queueChangedByBarrier(queue,barrier){const before=Array.isArray(queue)?queue:[],after=filterQueueAfterClear(before,barrier);return {queue:after,removed:before.length-after.length,changed:after.length!==before.length};}
function mirrorRequired(reason){return MIRROR_REASONS.includes(String(reason||''));}
function shouldSkipFingerprint(fp,lastFp,reason){return fp===lastFp&&!mirrorRequired(reason);}
function tombstoneClearedAt(reason,clean,updatedAtClient){return reason==='clear-tombstone'?((clean&&clean.clientUpdatedAt)||updatedAtClient):null;}
function writeMetadata(input){const x=input||{},updatedAtClient=x.updatedAtClient;const meta={ownerUid:x.uid,version:x.version,updatedAtClient,clientId:x.clientId,lastOperationId:x.lastOperationId,data:x.data,backup:{updatedAtClient,data:x.data}};const clearedAt=tombstoneClearedAt(x.reason,x.data,updatedAtClient);if(clearedAt)meta.clearedAt=clearedAt;return meta;}
global.MongoCloud=Object.freeze({MIRROR_REASONS,stamp,chooseCloudOrLocal,candidateTime,sortNewestCandidates,chooseClearBarrier,queueItemAllowedAfterClear,filterQueueAfterClear,queueChangedByBarrier,mirrorRequired,shouldSkipFingerprint,tombstoneClearedAt,writeMetadata});
})(window);
