// Möngö Cloud — Phase 2 reset safety
(function(global){
'use strict';
const MIRROR_REASONS=Object.freeze(['force','login-mirror','legacy-path-migration','first-cloud-migration','bootstrap-mirror','clear-tombstone']);
const LEGACY_SOURCES=Object.freeze(['legacy-financial','settings-fallback','profile-fallback','user-root-fallback']);
const REQUIRED_MIRRORS=Object.freeze(['appState','financial','settings','profile','user-root']);
function stamp(v){const n=Date.parse(v||'');return Number.isFinite(n)?n:0;}
function chooseCloudOrLocal(input){const x=input||{},local=x.local||{},cloud=x.cloud||{},localHas=!!x.localHas,cloudHas=!!x.cloudHas;if(cloudHas&&!localHas)return {winner:'cloud',source:'cloud'};if(localHas&&!cloudHas)return {winner:'local',source:'local-migrate'};if(!localHas&&!cloudHas)return {winner:'cloud',source:'cloud-empty'};const localTime=stamp(local.clientUpdatedAt||x.localUpdatedAt),cloudTime=stamp(cloud.clientUpdatedAt||x.cloudUpdatedAt);if(localTime&&cloudTime&&localTime>cloudTime)return {winner:'local',source:'local-newer'};return {winner:'cloud',source:'cloud'};}
function candidateTime(candidate){const raw=candidate&&candidate.raw||{};return stamp(raw.updatedAtClient||(raw.data&&raw.data.clientUpdatedAt));}
function sortNewestCandidates(candidates){return [...(Array.isArray(candidates)?candidates:[])].sort((a,b)=>candidateTime(b)-candidateTime(a));}
function makeCandidate(raw,source){return raw&&raw.data?{raw,source}:null;}
function unwrapFinancialState(container,source){return makeCandidate(container&&container.financialState,source);}
function compactCandidates(items){return (Array.isArray(items)?items:[]).filter(Boolean);}
function selectLoadCandidate(candidates,isMeaningful){const ordered=sortNewestCandidates(compactCandidates(candidates)),newest=ordered[0]||null;if(newest&&newest.raw&&newest.raw.clearedAt)return {selected:newest,newest,ordered,clearMarker:true};const meaningful=ordered.filter(c=>typeof isMeaningful==='function'&&isMeaningful(c.raw&&c.raw.data));return {selected:meaningful[0]||newest,newest,ordered,clearMarker:false};}
const REQUIRED_STATE_ARRAYS=Object.freeze(['txns','goals','debts','invests','moneyAccounts','accountTransfers','moneyLedger','moneyLedgerTombstones']);
function stateCompleteness(data){
  const d=data&&typeof data==='object'?data:{},missing=REQUIRED_STATE_ARRAYS.filter(k=>!Array.isArray(d[k]));
  if(!d.budgets||typeof d.budgets!=='object'||Array.isArray(d.budgets))missing.push('budgets');
  const complete=missing.length===0;
  return {complete,missing};
}
function stateRevision(data){const n=Number(data&&data.moneyLedgerRevision);return Number.isFinite(n)&&n>=0?n:0;}
function stateRichness(data){
  const d=data&&typeof data==='object'?data:{};
  return REQUIRED_STATE_ARRAYS.reduce((sum,k)=>sum+(Array.isArray(d[k])?d[k].length:0),0)+Object.keys(d.budgets&&typeof d.budgets==='object'?d.budgets:{}).length;
}
function safeCandidateOrder(a,b){
  const ad=a&&a.raw&&a.raw.data,bd=b&&b.raw&&b.raw.data;
  return stateRevision(bd)-stateRevision(ad)||stateRichness(bd)-stateRichness(ad)||candidateTime(b)-candidateTime(a);
}
function selectSafeLoadCandidate(candidates){
  const all=compactCandidates(candidates),newest=sortNewestCandidates(all)[0]||null;
  if(newest&&newest.raw&&newest.raw.clearedAt)return {selected:newest,newest,ordered:sortNewestCandidates(all),clearMarker:true,blocked:false,quarantined:[]};
  const complete=all.filter(c=>stateCompleteness(c&&c.raw&&c.raw.data).complete).sort(safeCandidateOrder);
  const selected=complete[0]||null,quarantined=all.filter(c=>!stateCompleteness(c&&c.raw&&c.raw.data).complete||c!==selected&&safeCandidateOrder(selected,c)<0);
  return {selected,newest,ordered:complete,clearMarker:false,blocked:!selected,quarantined};
}
function activeClearBarrier(barrier){return !!(barrier&&barrier.active!==false&&barrier.clearedAt&&barrier.data);}
function selectLoadCandidateWithBarrier(candidates,isMeaningful,barrier){
  const cloudDecision=selectLoadCandidate(candidates,isMeaningful);
  if(!activeClearBarrier(barrier))return Object.assign({},cloudDecision,{barrierActive:false,cloudDecision});
  const raw={clearedAt:barrier.clearedAt,updatedAtClient:barrier.clearedAt,data:barrier.data};
  const selected={raw,source:'local-clear-barrier'};
  return {selected,newest:cloudDecision.newest,ordered:cloudDecision.ordered,clearMarker:true,barrierActive:true,cloudDecision};
}
function requiresCanonicalMigration(source){return LEGACY_SOURCES.includes(String(source||''));}
function chooseClearBarrier(input){const x=input||{},barrier=x.barrier||null;if(!barrier||!barrier.data)return {useBarrier:false};const barrierTime=stamp(barrier.clearedAt),localTime=stamp(x.localUpdatedAt),cloudTime=stamp(x.newestCloudUpdatedAt);return {useBarrier:!!barrierTime&&barrierTime>=localTime&&barrierTime>=cloudTime,barrierTime,localTime,cloudTime};}
function queueItemAllowedAfterClear(item,barrier){if(!barrier||!barrier.clearedAt)return true;if(item&&item.reason==='clear-tombstone')return true;return stamp(item&&item.createdAt)>stamp(barrier.clearedAt);}
function filterQueueAfterClear(queue,barrier){return (Array.isArray(queue)?queue:[]).filter(item=>queueItemAllowedAfterClear(item,barrier));}
function queueChangedByBarrier(queue,barrier){const before=Array.isArray(queue)?queue:[],after=filterQueueAfterClear(before,barrier);return {queue:after,removed:before.length-after.length,changed:after.length!==before.length};}
function mirrorRequired(reason){return MIRROR_REASONS.includes(String(reason||''));}
function shouldSkipFingerprint(fp,lastFp,reason){return fp===lastFp&&!mirrorRequired(reason);}
function tombstoneClearedAt(reason,clean,updatedAtClient){return reason==='clear-tombstone'?((clean&&clean.clientUpdatedAt)||updatedAtClient):null;}
function writeMetadata(input){const x=input||{},updatedAtClient=x.updatedAtClient;const meta={ownerUid:x.uid,version:x.version,updatedAtClient,clientId:x.clientId,lastOperationId:x.lastOperationId,data:x.data,backup:{updatedAtClient,data:x.data}};const clearedAt=tombstoneClearedAt(x.reason,x.data,updatedAtClient);if(clearedAt)meta.clearedAt=clearedAt;return meta;}
function missingRequiredMirrors(paths){const found=new Set((paths||[]).map(String));return REQUIRED_MIRRORS.filter(x=>!found.has(x));}
function completeMirrorWrite(paths){const missing=missingRequiredMirrors(paths);return {complete:missing.length===0,missing,paths:[...(paths||[])]};}
function diagnosticSnapshot(){
  let lastFinancialWriteError='';
  try{lastFinancialWriteError=global.MONGO_LAST_FINANCIAL_WRITE_ERROR||'';}catch(e){}
  return Object.freeze({mongoCloudLoaded:true,requiredMirrors:[...REQUIRED_MIRRORS],lastFinancialWriteError,capturedAt:new Date().toISOString()});
}
function showDiagnosticPanel(){
  const old=document.getElementById('mongo-cloud-diagnostic-panel');if(old)old.remove();
  const snap=diagnosticSnapshot(),panel=document.createElement('div');panel.id='mongo-cloud-diagnostic-panel';
  panel.style.cssText='position:fixed;z-index:2147483647;left:12px;right:12px;top:12px;max-height:82vh;overflow:auto;background:#fff;color:#111;border:2px solid #b91c1c;border-radius:14px;padding:14px;font:13px/1.45 monospace;box-shadow:0 8px 30px rgba(0,0,0,.28);white-space:pre-wrap;word-break:break-word';
  const close=document.createElement('button');close.textContent='Хаах';close.type='button';close.style.cssText='float:right;padding:7px 12px;margin:0 0 8px 10px';close.onclick=()=>panel.remove();panel.appendChild(close);
  const title=document.createElement('strong');title.textContent='Möngö Cloud diagnostic (READ ONLY)';panel.appendChild(title);
  const pre=document.createElement('pre');pre.style.cssText='clear:both;margin:12px 0 0;white-space:pre-wrap;word-break:break-word';pre.textContent=JSON.stringify(snap,null,2);panel.appendChild(pre);document.body.appendChild(panel);return snap;
}
function installDiagnosticTrigger(){
  if(!global.location||!/(?:[?&])cloudDiag=1(?:&|$)/.test(global.location.search||''))return;
  const ready=()=>{if(!document.body)return setTimeout(ready,50);showDiagnosticPanel();};ready();
}
async function runSafeHardReset(ops){
  const x=ops||{};
  if(typeof x.emptyMemory!=='function'||typeof x.purgeLocal!=='function'||typeof x.clearFinancialData!=='function')throw new Error('reset-ops-missing');
  x.emptyMemory();x.purgeLocal();
  const cloudCleared=await x.clearFinancialData();
  if(cloudCleared===false)throw new Error('reset-cloud-clear-failed');
  x.emptyMemory();x.purgeLocal();
  if(typeof x.reload==='function')x.reload();
  return {cleared:true,cloudClearCalls:1,forceReloadCalls:0};
}
global.MongoCloud=Object.freeze({MIRROR_REASONS,LEGACY_SOURCES,REQUIRED_MIRRORS,REQUIRED_STATE_ARRAYS,stamp,chooseCloudOrLocal,candidateTime,sortNewestCandidates,makeCandidate,unwrapFinancialState,compactCandidates,selectLoadCandidate,stateCompleteness,stateRevision,stateRichness,safeCandidateOrder,selectSafeLoadCandidate,activeClearBarrier,selectLoadCandidateWithBarrier,requiresCanonicalMigration,chooseClearBarrier,queueItemAllowedAfterClear,filterQueueAfterClear,queueChangedByBarrier,mirrorRequired,shouldSkipFingerprint,tombstoneClearedAt,writeMetadata,missingRequiredMirrors,completeMirrorWrite,diagnosticSnapshot,showDiagnosticPanel,runSafeHardReset});
installDiagnosticTrigger();
})(window);
