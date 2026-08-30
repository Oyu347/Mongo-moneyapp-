# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE.

### Cloud — Phase 1A: cloud/local ordering and clear-barrier foundation
Module: `aa4509b2c80e519366dd487ff5a87d7c41f073ad`
Tests: `d47302aec6b474b867865defd6da98e5d52f1f35`

- Added `src/services/cloud/cloud.js` as a pure decision layer with no Firebase, localStorage or UI side effects.
- `chooseCloudOrLocal()` preserves empty-new-browser vs meaningful-cloud behavior and local migration behavior.
- When both sides are meaningful, any genuinely newer local timestamp wins; stale cloud must not overwrite a newer locally committed transaction.
- Cloud mirror candidates are ordered by `updatedAtClient` / `data.clientUpdatedAt` through a pure helper.
- Clear-barrier decision is modularized: a completed local reset wins over older/equal local and cloud timestamps, preventing stale cloud resurrection while the tombstone is pending.
- Added pure queue filtering policy for future queue migration: pre-clear stale queue writes are rejected, the clear tombstone survives, and genuinely post-clear writes may proceed.
- Prepared `index.modular-cloud-phase1a.html`: active cloud/local choice, mirror ordering and clear-barrier decision delegate to `MongoCloud`.
- Firebase reads/writes, queue persistence/processing, auth gates, snapshot/meta persistence, sync-status UI and reset side effects remain inline.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Cloud Node regression test file was committed but is not recorded as executed. Browser/Firebase runtime parity is not recorded as executed.

## Current state
Cloud Phase 1A establishes pure ordering/conflict and reset-barrier decisions without moving Firebase or persistence side effects.

## NEXT STEP
### Cloud — Phase 1B: queue stale-write protection
1. Integrate `filterQueueAfterClear()` at the bounded queue read/process boundary.
2. Ensure an old queued financial save created before `clearedAt` can never run after reset and recreate deleted data.
3. Preserve `clear-tombstone` even when its timestamp equals the barrier.
4. Preserve genuinely new post-reset edits and their queue items.
5. Keep Firebase writer, auth and UI inline.
6. Add focused regression cases and static syntax validation.

## Future order
Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
