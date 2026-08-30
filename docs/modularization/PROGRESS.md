# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE; i18n Phase 1 COMPLETE; Web Phase 1 COMPLETE.

### Web phases
- 1A module `de803b48cfc982be2230df5bef208bd966c97251`; tests `f07d889804efd38a26d93b6f9fd43da95393df4`.
- 1B module `5805ada17a9c82e70ee66556bfdbb223f5ba8edf`; tests `72d458b1d7f53985676d6a4bf95d395e53d3f518`.
- 1C module `ace8dc72b8e931dc0110b273d8c7a1169d3f07bf`; tests `0c4f4f12cf1d9a887e71e9e6e39dd3b08886e58b`.
- 1D module marker `1ad7692fbfd86de37a8b1a3d1a4ade5e177dd7c4`.
- 1E closure marker `f0a662cb16f13a9493c27e6566b0e425d49400a8`.

### Web — Phase 1E closure
- Re-audited the latest prepared Phase 1D HTML and retained the remaining browser lifecycle listeners with their feature/service owners rather than bulk-migrating them.
- Remaining direct lifecycle inventory at closure: 17 pageshow, 6 visibility-change, 3 online, 1 offline, 1 beforeunload.
- The remaining listeners are coupled to trial UI/bootstrap, localized UI wiring, account/loan form refresh, financial/loan ledger bootstraps, Firebase/account-ready synchronization, Cloud queue/health/save behavior and related feature policy. They are not generic Web responsibilities merely because they use browser events.
- Cloud online/offline/visibility/beforeunload listeners explicitly remain Cloud-owned; auth/Firebase visibility/online behavior remains auth/service-owned; financial bootstrap pageshow/visibility behavior remains feature/core-owned.
- Generic browser mechanics now owned by `MongoWeb`: capability checks, backup text download, backup file text reading, reload, pageshow/visible/focus subscriptions.
- Presence/static audit on `index.modular-web-phase1d.html`: one `src/web/platform.js` load; zero direct `new Blob`, zero direct `new FileReader`, zero direct `location.reload`; 44 non-empty inline JavaScript blocks, 0 syntax errors.
- No additional HTML behavior change was required for closure; `index.modular-web-phase1d.html` is the Web Phase 1 closure prepared HTML.
- Web Node regression tests were committed during prior phases but are not recorded as executed. Browser/runtime parity was not executed.

## Current state
Web Phase 1 is closed. Browser mechanics have a bounded compatibility owner while feature, financial, Cloud, auth, trial and UI policies remain in their proper boundaries.

## NEXT STEP
### Mobile — Phase 1A: platform-boundary inventory
1. Inspect the latest prepared HTML and repository for Capacitor/native/mobile-specific assumptions, viewport/safe-area/touch behavior and platform integration points.
2. Do not change financial behavior, Cloud semantics or Web behavior merely to prepare Mobile.
3. Create a small `src/mobile/` compatibility module only if a parity-safe platform boundary is identifiable.
4. Record what remains web-only versus what a Capacitor shell will need to adapt.
5. Add focused tests where practical and run static syntax validation.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
