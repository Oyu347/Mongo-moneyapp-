# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE; i18n Phase 1 COMPLETE; Web Phase 1 COMPLETE.

### Mobile — Phase 1A: platform-boundary inventory + foundation
Module `37f8eb300ac22dca69449533b261c3180ca1eb08`; tests `b8902d8b084c85f3e3214df9c3e1e7e7a19ca4c6`.

- Latest prepared HTML currently has no direct Capacitor or Cordova integration, no user-agent platform branching, no standalone/PWA display-mode check, no visualViewport or orientation integration.
- Existing mobile-sensitive behavior is primarily CSS safe-area usage (5 `safe-area-inset-*` occurrences) and custom touch/pointer handling for select controls. Those are existing UI behavior and were not changed.
- Added `src/mobile/platform.js` as a small compatibility boundary exposing Capacitor presence, native-platform detection, platform name and touch capability. With no Capacitor runtime it deterministically reports web/non-native, preserving current web behavior.
- No Capacitor plugin calls were introduced. No native filesystem, status bar, keyboard, app lifecycle, deep-link or store/payment behavior was invented.
- Prepared `index.modular-mobile-phase1a.html` with one `src/mobile/platform.js` load after the Web platform module. No existing caller was migrated because the current HTML contains no native/platform branch to replace safely.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Mobile Node regression test file was committed but is not recorded as executed. Android/iOS/Capacitor runtime parity was not executed.

## Current state
Mobile Phase 1A establishes a no-op-on-web platform boundary without changing current app behavior. The current app remains web-first; a future Capacitor shell can use `MongoMobile` for explicit platform decisions.

## NEXT STEP
### Mobile — Phase 1B: shell requirements and safe-area/touch review
1. Inventory the exact Capacitor shell requirements needed around the current web app: app lifecycle, deep links, keyboard/status bar, file/share and native back behavior, without implementing unproven plugins.
2. Review safe-area CSS and touch/pointer behavior for native WebView compatibility; preserve current UI semantics unless a concrete incompatibility is identified.
3. Separate requirements/documentation from runtime code; add native adapters only when there is an actual current caller or approved mobile behavior.
4. Run static syntax validation and focused tests.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
