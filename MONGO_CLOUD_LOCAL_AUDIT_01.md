# Möngö — Cloud/Local Read-Write Path Audit 01
Date: 2026-10-28
Status: READ-ONLY STATIC AUDIT, NOT PRODUCTION CONFIRMATION
Source: uploaded index (4).html, 2,057,260 bytes, previously used for PATCH prototypes.
Canonical branch: feature/completed-cards-archive. GitHub index.html byte equality NOT verified.
No app/Firebase/production data modified.

## Observed paths and code locations (source line numbers)
- saveData ~10221–10259: MongoStorage.setJSON(getDBKey(),data); showSaveIndicator(); catches errors and logs warning; does not return explicit success/failure. Verify MongoStorage.setJSON return contract and save indicator semantics.
- CloudDataService wrapper ~13749–13750: calls originalSaveData(), then scheduleCloudSave('saveData'), returns original result; no explicit check for local persistence success.
- applyFinancialState ~12852–12870: sanitizes incoming raw, sets applyingCloud, resetDefaultFinanceShell(), replaces txns/goals/debts/invests/etc; localStorage.setItem(getDBKey(),JSON.stringify(data)) errors swallowed; rerenderFinance(), fingerprint and saveSnapshot() proceed. Potential in-memory replacement even if durable local save fails.
- setQueue ~12716–12719: stores safeArray(q).slice(-MAX_QUEUE), MAX_QUEUE=40; storage errors swallowed. Potential unacknowledged queue-item truncation if backlog exceeds 40; confirm actual workload and queue safety tests.
- getQueue ~12707–12715: returns [] on parse/storage errors, potentially conflating failure with truly empty queue.
- saveSnapshot ~12720–12726: writes one snapshot to localStorage; storage errors swallowed, no explicit durable verification; snapshot may be replaced by queued/unverified state.
- enqueueSave ~12882–12893: deduplicates by fingerprint, setQueue(q), saveSnapshot(payload.data), schedules queue, returns operation id without confirming durable enqueue.
- processQueue ~13541–13556: writeCloud(item.data), then shift/setQueue; retries on error. Verify atomicity/idempotency across partial cloud mirrors, crash and queue write failure.
- writeCloud ~13438–13539: multiple Firestore mirror .set writes launched separately, Promise.all, then completeMirrorWrite checks. Some paths may persist before partial failure. Preflight v152 and quarantine checks exist; not a Firestore transaction across mirrors.
- loadCloudFinancialData ~13612–13747: reads appState/legacy/settings/profile/root candidates; selects safe candidate and has partial-state and V164 conflict blocks; offline and catch fallback call applyFinancialState(snapshot); local-newer path may enqueue; migration may write Cloud. Inspect protections in all paths, not just happy path.
- cloud load ~13731–13740: when no chosen cloud raw and local meaningful, calls writeCloud(local,'force'). Verify how unreadable/permission-denied mirrors and empty candidate sets are differentiated.
- Cloud write result ~13523–13538: partial mirror failure throws even if one or more mirrors wrote. Retry semantics and cross-device candidate choice need controlled tests.

## Existing protections observed (do not remove)
- MONGO_CLOUD_PARTIAL_STATE_BLOCKED blocks ordinary writes.
- v152PreflightCloudWrite invoked for ordinary writes.
- V164 local-newer vs cloud-size conflict guard.
- selectSafeLoadCandidate and clear barrier/tombstone logic.
- UID checks before Cloud read/write.
These are source-level observations, not verified guarantees.

## Risk priority and proposed synthetic tests
P0-A: Force localStorage.setItem to throw during applyFinancialState; assert old in-memory/local/snapshot state preserved and no 'saved' signal.
P0-B: Force MongoStorage.setJSON failure; assert saveData reports failure and Cloud queue does not claim durable local success.
P0-C: Queue 41+ unique unsynced operations, reload, verify every operation is recoverable or safely compacted with proof of cloud acknowledgment.
P0-D: Inject snapshot quota errors and corrupt JSON; verify recovery path fails closed rather than silently empty.
P0-E: One Firestore mirror succeeds, others fail; retry, relogin, two devices; verify deterministic version selection and no stale overwrite.
P0-F: Simulate 206-vs-11 records, valid local/newer/cloud, offline/reconnect; assert no destructive overwrite and recovery.
P0-G: UID switch mid-sync and intentional delete tombstone; verify isolation and no resurrection.
P1: Full schema migrations, backup/restore and Ledger reconciliation.

## Decision
NO production merge. First establish branch code identity and reproduce failures in a disposable test harness; preserve existing protections. Do not claim the historic data loss root cause is confirmed.
