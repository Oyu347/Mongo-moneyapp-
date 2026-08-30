# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE.

### Cloud — Phase 1A
Module `aa4509b2c80e519366dd487ff5a87d7c41f073ad`; tests `d47302aec6b474b867865defd6da98e5d52f1f35`.

### Cloud — Phase 1B: queue stale-write protection
Module: `5c47fc30bb3ec0b3746fbcada57de6515698f605`
Tests: `fe11dc0ed3b9e855abc10c919ca2fbcd242247d7`

- Active `getQueue()` boundary now filters persisted queue rows through the clear barrier before any queue processor can write them to Cloud.
- Ordinary queued writes created before or exactly at `clearedAt` are stale and are removed.
- `clear-tombstone` is explicitly preserved even when its creation timestamp equals the barrier.
- A genuinely post-reset edit (`createdAt > clearedAt`) remains eligible for Cloud sync.
- When stale rows are removed, the bounded queue read writes the filtered queue back to localStorage, so removed pre-clear writes do not reappear on the next process pass.
- Firebase writer, retry policy, auth gates, sync UI and reset side effects remain inline.
- Prepared `index.modular-cloud-phase1b.html` with one bounded queue-read integration.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Cloud Node regression suite and browser/Firebase runtime parity are not recorded as executed.

## Current state
Cloud conflict ordering, reset barrier and stale queued-write rejection are modularized. A reset cannot be undone by a pre-reset queue item at the active queue read/process boundary.

## NEXT STEP
### Cloud — Phase 1C: write payload / mirror policy boundary
1. Inspect `writeCloud()` fingerprint skip rules, mirror-required reasons and tombstone metadata.
2. Extract pure fingerprint-skip / mirror-reason / payload metadata decisions only.
3. Preserve canonical + compatible mirror behavior exactly; do not move Firebase `.set()` calls yet.
4. Preserve clear-tombstone forced mirror behavior.
5. Keep auth checks, Firestore calls, snapshots/meta and UI inline.
6. Add focused regression tests and static syntax validation.

## Future order
Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
