# Möngö V16 — Actual source write-path risk verification (2026-10-28)
Status: READ-ONLY CODE INSPECTION. No tests executed, no production patch, no Firebase access.
Branch: feature/completed-cards-archive
index.html blob SHA: 3770e27523c71745d53c33e68bd813bd3d36398c
Source obtained using GitHub fetch_blob (1,853,524 JavaScript string characters).

## Verified source excerpts (exact function names)
- `saveData()`: `window.MongoStorage.setJSON(getDBKey(),data); showSaveIndicator();` in try; catch only `console.warn('Save error:',e)`. No explicit success return; must inspect MongoStorage.setJSON semantics before claiming an actual failed write displays success.
- `getQueue()`: JSON parse and clear-barrier filtering; catch returns `[]`. Cannot distinguish corrupt/unreadable queue from genuinely empty queue.
- `setQueue(q)`: `localStorage.setItem(uidKey(QUEUE_KEY_PREFIX),JSON.stringify(safeArray(q).slice(-MAX_QUEUE)))` with empty catch. `MAX_QUEUE=40`. Truncation is unconditional on cloud ACK.
- `saveSnapshot(data,cloudMeta)`: localStorage write in try with empty catch; no success return.
- `enqueueSave(reason,data)`: calls getQueue, fingerprint dedup, pushes payload if new, calls setQueue, saveSnapshot, schedules processing, returns payload.id; does not confirm durable queue write. On duplicate fingerprint, returns a new ID not actually enqueued.
- `processQueue()`: on `await writeCloud(...)`, shifts queue then calls setQueue. If setQueue fails, memory and persisted queue can diverge. A failed retry setQueue also swallows failure.
- `saveCloudNow()`: direct online write, then prunes queued operations by createdAt vs saveStartedAt and processes remaining queue. Requires proof no unsynced older op is dropped.
- `applyFinancialState(raw,source)`: calls `resetDefaultFinanceShell()` and assigns financial arrays before later local persistence. Failure-atomicity is not established.
- `writeCloud(data,reason,...)`: V152 preflight applies to ordinary writes; `Promise.all` mirror writes and individual catches need partial-success tests.
- `v152PreflightCloudWrite`: five server snapshot reads; detects destructive shrink via `v152IsDestructiveShrink`, sets partial-state block on detection. Good existing safeguard; not a complete concurrency/atomicity guarantee.

## Evidence classification
VERIFIED SOURCE PROPERTY: unconditional queue cap, swallowed storage exceptions, missing save acknowledgment, in-memory reset-before-persist, multi-mirror write design.
NOT YET VERIFIED: real data loss, whether MongoStorage.setJSON throws or returns false, any specific cause of historical incidents, actual Firebase rules/deployed code.
HISTORICAL: Termux V15 tests are isolated; no fresh test run here.

## Safe next test plan (synthetic data only)
1. Inspect `MongoStorage.setJSON` implementation and wrapper `originalSaveData` to trace false-success conditions.
2. Test queue storage quota/corrupt JSON/41+ operations and reboot with isolated harness.
3. Test failed snapshot writes and `applyFinancialState` rollback.
4. Simulate partial Firestore mirror success and retries with mocked refs, then emulator.
5. Verify V152 with intentional deletes, restore, UID changes and two-device concurrent writes.
6. Preserve exact baseline, add only tests until reproduction; no real-user data.

## Required safety gate
Do not patch or deploy app until reproducible failing tests and verified restore/rollback are available.
