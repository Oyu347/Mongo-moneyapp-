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

### Web — Phase 1C: lifecycle compatibility
- Inventory found 21 direct `pageshow` subscriptions, 10 visibility-change subscriptions, 2 focus-related browser subscriptions, 3 online subscriptions, 1 offline subscription and the Cloud beforeunload persistence hook in the Phase 1B HTML.
- Added generic `MongoWeb.onPageShow`, `onVisible`, and `onFocus` event-subscription helpers plus event capability flags. These helpers contain no trial, billing, Cloud, auth or financial policy.
- Migrated one cohesive trial-access enforcement lifecycle cluster to the generic helpers while preserving its exact delays: pageshow 150ms, focus 100ms, visible 100ms. The `enforce()` policy itself remains inline.
- Remaining lifecycle listeners are intentionally not bulk-rewritten. Many are coupled to Cloud queueing, auth, transaction refresh, UI observers or feature-specific bootstrap behavior and require bounded parity review.
- Prepared `index.modular-web-phase1c.html`.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- After the bounded migration: 20 direct pageshow subscriptions and 9 direct visibility-change subscriptions remain; 3 `MongoWeb` lifecycle callers were added.
- Web Node regression test file was committed but is not recorded as executed. Browser/runtime lifecycle parity was not executed.

## Current state
Web Phase 1C provides generic browser lifecycle plumbing while feature/service policy remains with its existing owners.

## NEXT STEP
### Web — Phase 1D: bounded lifecycle migration + reset reload review
1. Migrate only simple UI refresh lifecycle pairs whose handlers are already self-contained and whose event semantics are exact.
2. Review the two remaining direct destructive-workflow reload calls; delegate only the generic reload mechanic if doing so cannot change ordering or failure behavior.
3. Do not migrate Cloud beforeunload/online/offline policy into Web.
4. Run static syntax validation and focused tests.

## Future order
Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
