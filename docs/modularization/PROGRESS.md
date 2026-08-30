# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE; i18n Phase 1 COMPLETE; Web Phase 1 COMPLETE.

### Mobile phases
- 1A module `37f8eb300ac22dca69449533b261c3180ca1eb08`; tests `b8902d8b084c85f3e3214df9c3e1e7e7a19ca4c6`.
- 1B requirements `91de64e88c301bd2f8d5288403a5a37c96190030`; module `863e606aa0c6db8742a605d41c7a6f4c24c39a4c`.

### Mobile — Phase 1B: shell requirements + safe-area/touch review
- Current viewport is `width=device-width, initial-scale=1.0`; `viewport-fit=cover` is not enabled. Existing CSS nevertheless has 5 safe-area inset uses. No global viewport change was made because edge-to-edge behavior must be tested across fixed headers, footers and bottom sheets before enabling it.
- Existing custom select behavior deliberately handles touchstart/touchend plus pointer events, including Android-specific native-select suppression comments. No touch behavior was changed without a demonstrated WebView incompatibility.
- Current HTML has no History API/popstate/native-back integration. Backup restore uses an HTML file input; backup export remains Web download behavior.
- Added `src/mobile/README.md` documenting shell requirements for app lifecycle/resume, deep links, keyboard, status bar/safe area, Android native back and file/share handling. These are validation requirements, not assumed plugin implementations.
- Extended `MongoMobile` with read-only plugin presence/capability detection for App, Keyboard, StatusBar, Filesystem and Share. It does not call plugins or change current behavior.
- No HTML behavior change was required in Phase 1B; `index.modular-mobile-phase1a.html` remains the prepared runtime baseline.
- Static syntax validation of the prepared baseline remains 44 non-empty inline JavaScript blocks, 0 syntax errors. Mobile/Capacitor runtime testing was not executed.

## Current state
Mobile Phase 1B has a documented shell contract and read-only capability boundary. Native behavior will only be added against an approved requirement and concrete caller.

## NEXT STEP
### Mobile — Phase 1C: bounded native lifecycle/deep-link contract
1. Define pure normalization helpers for native app-state and deep-link inputs without registering Capacitor listeners or changing Web behavior.
2. Keep payment/auth routing decisions outside Mobile; Mobile may normalize URL/platform events only.
3. Add focused tests for pure normalization helpers.
4. Run static syntax validation; do not claim Android/iOS runtime parity until actually tested.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
