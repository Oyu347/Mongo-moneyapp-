# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE; i18n Phase 1 COMPLETE.

### Web phases
- 1A module `de803b48cfc982be2230df5bef208bd966c97251`; tests `f07d889804efd38a26d93b6f9fd43da95393df4`.
- 1B module `5805ada17a9c82e70ee66556bfdbb223f5ba8edf`; tests `72d458b1d7f53985676d6a4bf95d395e53d3f518`.
- 1C module `ace8dc72b8e931dc0110b273d8c7a1169d3f07bf`; tests `0c4f4f12cf1d9a887e71e9e6e39dd3b08886e58b`.
- 1D module marker `1ad7692fbfd86de37a8b1a3d1a4ade5e177dd7c4`.

### Web — Phase 1D: bounded lifecycle migration + reset reload review
- Migrated three exact self-contained pageshow/visible refresh pairs to `MongoWeb.onPageShow` + `MongoWeb.onVisible`: `scheduleMoneyRefresh`, transaction commit-journal `restorePending`, and `refreshTransactionTab`.
- Handler policy and call timing remain unchanged; only generic browser event plumbing moved behind Web compatibility helpers.
- Reviewed both remaining destructive-workflow direct reloads. Clear-data reload occurs only after Cloud clear succeeds and local DB removal; hard-reset reload occurs only after the final wait/Cloud verification/local purge sequence. Replaced only the immediate `location.reload()` mechanics at those exact points with `MongoWeb.reload(0)`.
- No Cloud queue, beforeunload, online/offline, reset sequencing or deletion policy moved into Web.
- Prepared `index.modular-web-phase1d.html`.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Direct `location.reload()` calls in prepared HTML: 0. `MongoWeb.reload` callers: 3 (restore timed reload plus two exact immediate reset reloads).
- Direct pageshow subscriptions reduced to 17; direct visibility-change subscriptions reduced to 6.
- Browser/runtime lifecycle and destructive-reset parity were not executed. Existing Web Node regression test remains not recorded as executed.

## Current state
Web Phase 1D owns generic download/read/reload/lifecycle browser mechanics. Feature, financial, Cloud, auth, trial and destructive-reset policies remain outside Web.

## NEXT STEP
### Web — Phase 1E: Phase 1 closure
1. Audit remaining direct browser lifecycle/API usage and explicitly classify what should remain feature/service-owned.
2. Do not bulk-migrate Cloud/auth/financial bootstrap listeners merely to reduce counts.
3. Add a closure marker/documentation update and run static syntax/presence checks.
4. Close Web Phase 1, then begin Mobile Phase 1A with a platform-boundary inventory only.

## Future order
Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
