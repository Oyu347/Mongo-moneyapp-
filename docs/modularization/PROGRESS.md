# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE; i18n Phase 1 COMPLETE.

### Web phases
- 1A module `de803b48cfc982be2230df5bef208bd966c97251`; tests `f07d889804efd38a26d93b6f9fd43da95393df4`.
- 1B module `5805ada17a9c82e70ee66556bfdbb223f5ba8edf`; tests `72d458b1d7f53985676d6a4bf95d395e53d3f518`.

### Web — Phase 1B: file-read + bounded reload migration
- Delegated only raw `FileReader.readAsText` mechanics in `importData()` to `MongoWeb.readTextFile(...)`.
- Security parsing (`secParseBackup`), backup size limit, local persistence, Cloud restore/save, messages and input reset remain inline and unchanged in responsibility.
- Restore's exact 350ms reload scheduling now delegates to `MongoWeb.reload(350)`; no timing policy was changed.
- Two other direct reload calls remain inline: clear-data reload and hard-reset reload. They are coupled to destructive data-reset workflows and were intentionally not migrated in this bounded phase.
- Password-reset URL construction and Firebase/auth browser-location usage remain outside Web.
- Prepared `index.modular-web-phase1b.html`.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Direct `new FileReader(...)` calls in prepared HTML: 0. Direct `location.reload()` calls remaining: 2. `MongoWeb.readTextFile` callers: 1; `MongoWeb.reload` callers: 1.
- Web Node regression test file was committed but is not recorded as executed. Browser/runtime restore parity was not executed.

## Current state
Web Phase 1B owns generic backup download/file-read mechanics and one parity-safe timed reload. Destructive reset workflows and auth/cloud policies remain in their proper feature/service boundaries.

## NEXT STEP
### Web — Phase 1C: lifecycle/capability boundary
1. Inventory generic page lifecycle signals (`pageshow`, focus, visibility) separately from the feature/cloud actions they trigger.
2. Add only generic event subscription/capability helpers if they reduce repeated browser plumbing without moving policy into Web.
3. Keep Cloud online/offline queue policy, trial enforcement and billing/auth decisions in their existing modules/inline owners.
4. Run static syntax validation and focused tests.

## Future order
Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
