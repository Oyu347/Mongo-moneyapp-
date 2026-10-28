# Möngö — V16 Current Branch Code Identity & P0 Read/Write Audit
Date: 2026-10-28
Status: READ-ONLY SOURCE INSPECTION. NO runtime tests, Firebase tests, production changes, or patch merge.
Branch: feature/completed-cards-archive
File: index.html
Git blob SHA: 3770e27523c71745d53c33e68bd813bd3d36398c
GitHub fetch_file returned empty text; **fetch_blob by SHA returned 1,853,524 characters of source**. Source identity is established for this blob. Do not assume previous uploaded index (4).html is identical.

## Direct observations in actual GitHub blob
1. `saveData()`: constructs `secNormalizeData(...)`, calls `window.MongoStorage.setJSON(getDBKey(),data)`, then `showSaveIndicator()`; catches and warns without explicit error return. Need verify setJSON contract; no successful cloud commit established.
2. `applyFinancialState(raw,source)`: sanitizes raw, sets `applyingCloud=true`, calls `resetDefaultFinanceShell()`, replaces financial arrays and ledger; localStorage.setItem errors are swallowed later in path (per previous audit). This replacement path needs failure-injection tests.
3. `MAX_QUEUE=40`; `setQueue(q)` stores `safeArray(q).slice(-MAX_QUEUE)`, swallows localStorage errors and sets status based on passed q length, not persisted result. `getQueue` read errors can be interpreted as empty.
4. `saveSnapshot(data,cloudMeta)` writes localStorage and swallows errors; no explicit success acknowledgment.
5. `enqueueSave` adds a fingerprint-deduplicated operation to queue, calls setQueue and saveSnapshot, schedules process and returns operation ID; no durable queue acknowledgment.
6. `processQueue` awaits `writeCloud`, then shifts and setQueue; failed queue persistence after shift may be unsafe depending on reload behavior.
7. `writeCloud` checks currentUid/auth readiness and `MONGO_CLOUD_PARTIAL_STATE_BLOCKED`; ordinary writes call `v152PreflightCloudWrite`. It writes multiple Firestore mirrors; separate writes require failure and retry tests.
8. `v152PreflightCloudWrite` fetches server snapshots across appState/financial/settings/profile/root and checks `v152IsDestructiveShrink`. Monitor V155 observes without changing allow/deny.
9. Existing protections: V152 preflight, UID checks, quarantine, local-vs-cloud conflict logic; do NOT remove without tests.

## Risk classification
- P0 confirmed code property: saveData does not return explicit success/failure; setQueue truncates to 40 and suppresses storage failures; snapshot errors suppressed; applyFinancialState resets state before durable confirmation.
- P0 unproven outcome: whether any of these caused the two reported data-loss incidents. Requires controlled reproduction.
- Unknown: exact current deployed commit; full Firestore Security Rules/Cloud Functions equivalence; setJSON internals; user-level outcomes.
- No proof yet of millions-user scalability or Firebase production reliability.

## Next isolated tests (synthetic data only)
A. Inject localStorage quota exception in saveData/applyFinancialState; verify no misleading success or loss.
B. Queue 41+ offline distinct operations, restart, reconnect; verify no unsynced event disappears.
C. Snapshot write failure, corrupted JSON and recoverability.
D. Partial Firestore mirror success, missing ACK, retry and two-device conflict.
E. Test V152 destructive shrink with realistic ledger-linked records, schema migrations and intentional clear tombstones.
F. Compare V359/V360 security rules against current repo and Firebase emulator; check auth user isolation.

## Release gate
No app integration until failure-injection tests reproduce and then resolve P0 issues; retain old blob SHA and backup; integrate on separate branch with staged tests.
