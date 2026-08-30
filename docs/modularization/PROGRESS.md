# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE; i18n Phase 1 COMPLETE; Web Phase 1 COMPLETE.

### Mobile phases
- 1A module `37f8eb300ac22dca69449533b261c3180ca1eb08`; tests `b8902d8b084c85f3e3214df9c3e1e7e7a19ca4c6`.
- 1B requirements `91de64e88c301bd2f8d5288403a5a37c96190030`; module `863e606aa0c6db8742a605d41c7a6f4c24c39a4c`.
- 1C module `040ee2e69f5bed4aca560cfbd69fe2e5d153e1e5`; tests `a1bb50c6dfc0f26f9cbb7b2b5b8427720edddab0`.

### Mobile — Phase 1C: bounded lifecycle/deep-link contract
- Added pure `normalizeAppState(event)` returning only normalized active/inactive state.
- Added pure `normalizeDeepLink(event, env)` returning URL/protocol/host/path/search/hash plus validity. It performs no routing, payment, auth, Cloud or UI decision.
- No Capacitor listener is registered and no native plugin is called. Current Web runtime behavior is unchanged.
- Tests cover web/native platform detection, plugin presence, app-state normalization, valid custom-scheme deep link parsing and invalid/empty URL handling. Test file was committed but is not recorded as executed.
- No HTML behavior change was required; `index.modular-mobile-phase1a.html` remains the runtime baseline with the mobile module load.
- Static syntax validation executed on the prepared baseline: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Android/iOS/Capacitor runtime parity was not executed.

## Current state
Mobile Phase 1C has a pure native-event normalization contract ready for future shell wiring without taking ownership of business routing.

## NEXT STEP
### Mobile — Phase 1D: native-back/file boundary design
1. Define pure normalization/decision-input helpers for native back and file/share capability without intercepting Android back or changing backup semantics.
2. Keep modal/tab/exit precedence in UI policy, not Mobile platform plumbing.
3. Keep backup payload/security/storage policy in existing Web/storage/Cloud owners; Mobile may expose native file/share capability only.
4. Add focused tests and static syntax validation.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
