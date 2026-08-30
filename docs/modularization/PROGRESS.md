# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE; i18n Phase 1 COMPLETE; Web Phase 1 COMPLETE; Mobile Phase 1 COMPLETE.

### Mobile phases
- 1A module `37f8eb300ac22dca69449533b261c3180ca1eb08`; tests `b8902d8b084c85f3e3214df9c3e1e7e7a19ca4c6`.
- 1B requirements `91de64e88c301bd2f8d5288403a5a37c96190030`; module `863e606aa0c6db8742a605d41c7a6f4c24c39a4c`.
- 1C module `040ee2e69f5bed4aca560cfbd69fe2e5d153e1e5`; tests `a1bb50c6dfc0f26f9cbb7b2b5b8427720edddab0`.
- 1D module `0266848ef8b90dc5f3fec7ba6e69cb7e69a67fa4`; tests `9c393a40b12728c880d1661eb2bf7f0d62b5079a`.
- 1E closure marker `08590c3e0b0b02f7859ce3331484bc26517a6172`.

### Mobile — Phase 1E closure
- Re-audited the Mobile platform boundary. It contains only platform detection, plugin-presence checks and pure normalization of app-state, deep-link and native-back event inputs. No financial, Cloud, storage, auth, payment or UI-routing policy is present.
- No Capacitor listener registration and no plugin invocation has been introduced. The module does not intercept Android back, route deep links, write/share files, alter status bar/keyboard behavior or enable edge-to-edge display.
- Prepared closure HTML `index.modular-mobile-phase1e.html` is behavior-identical to the Phase 1A runtime baseline; only the loaded small module evolved on the branch.
- Closure presence audit: exactly one `src/mobile/platform.js` load; zero direct Capacitor references in prepared HTML; zero Cordova references; no `viewport-fit=cover`; five existing safe-area CSS references remain unchanged.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Android/iOS/Capacitor runtime parity remains not executed.

## Modularization extraction milestone
The planned Phase 1 extraction order is complete:
Storage → Core → Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

Subscription/Trial access policy was subsequently extracted as a compatibility module on `development-modular` so the existing Day 5/7/8 policy could be regression-tested without changing `main`.

This does NOT mean production integration is automatically proven. The large prepared HTML chain remains local because the repository contents connector is not safe for round-tripping the full ~1.48 MB index file. `main` remains untouched.

## Integration validation — Node regression milestone
- GitHub Actions workflow: `.github/workflows/modular-regression.yml`, Node 22, executes every `tests/**/*.test.js` file in sorted order on `development-modular` pushes.
- Final early boundary correction commit: `6f9b2306d53a0ac2240f9120229c08b9eee67080` (`test(loans): align principal tolerance boundary`).
- GitHub Actions run #5 (`33290366351`) completed successfully for that exact commit.
- Subsequent workflow runs continue to execute the Node suite together with browser regressions.
- Validation corrections were confined to regression expectations/fixtures where tests did not match extracted Phase 1 API behavior; production financial logic was not changed merely to make those tests green.

## Integration validation — browser regression milestones
The following deterministic browser checkpoints are confirmed green on `development-modular`:
- Run #10 (`33292750781`): isolated extracted-module loading smoke test, after correcting the expected global name to `MongoLedgerCore`.
- Run #12 (`33292875349`): financial flow regression — income, expense, internal transfers, savings transfer, account totals and ledger validation.
- Run #14 (`33293028747`): loan/savings/budget regression — loan principal/interest split, remaining balance, savings transfer + savings-interest budget actuals and progress.
- Run #17 (`33293156751`): assets/budget regression. Run #16 exposed a test-fixture shape mismatch for `investmentSourceEligible`; the fixture was corrected without changing production logic.
- Cloud/Storage reset regression: confirmed green after adding stale-local/cloud selection, clear barrier/tombstone, queue filtering and storage removal coverage.
- Run #21: seven-locale/currency browser regression confirmed green for mn/en/zh/ja/ko/ru/de, supported currency symbols, dictionary fallback and locale normalization.
- Subscription/Trial module commits: `e04c020fa0953c71b678f1e0d06184c780a08d9d` and test `7c0abe02257b4c1b2b6363ba706b484f55bd0317`; Node workflow run #23 (`33293563875`) succeeded.
- Trial/Paywall browser test commit `60eec0ba16cf15cb3aa66be197c86dadc8420595`; workflow commit `d57a4bbbf6055d580602c41649821751b86777c4`; run #25 (`33293630403`) completed successfully. Covered Day 5/7 reminders, Day 8 expired/read-only state, view access, blocked write actions, Loan navigation/calculator remaining available, Savings/Investment calculators remaining premium, and paid-user access.
- Expanded subscription wrapper parity run #32 (`33294728495`) succeeded at branch head `86d5ef9fcca0388e397f39406199765ad3c3b513`.

These browser tests validate extracted modules and deterministic synthetic flows. They do NOT yet prove the exact full prepared ~1.48 MB application runtime, live Firebase behavior, payment/QPay behavior, complete UI event wiring, backup/restore UI, or Android/iOS Capacitor runtime.

## Phone runtime checkpoint — 2026-08-30
A clean prepared HTML checkpoint was validated manually on Android Chrome via local `content://` loading.

Confirmed behavior:
- Day 5 reminder renders correctly (2 days remaining).
- Day 7 reminder renders correctly (last trial day).
- Day 8 read-only/paywall behavior preserves Loan navigation and the Loan calculator.
- Loan calculator executes and renders payment, total interest and total repayment results on Day 8.
- Loan write actions remain Premium-protected in Day 8 read-only mode.
- Root cause of the previously non-running Loan calculator was calculator-language initialization order: `CALC_LANGS` could be referenced before initialization. The clean prepared checkpoint uses initialization-safe `var CALC_LANGS` plus a defensive `CT()` fallback.
- Temporary event-handler/debug patches used during diagnosis were discarded; the clean checkpoint does not depend on them.
- QA Day selector, `TEST · DAY` badge, diagnostic Day override and its Day-5 default were removed after regression. The final clean local file uses the real trial day.
- Final clean local checkpoint: `index.modular-clean-regression-checkpoint.html`.
- Static validation of that clean checkpoint: 53 non-empty inline JavaScript blocks, 0 syntax errors.
- User visually confirmed the clean checkpoint opens and the dashboard/navigation render normally on Android.

Important limitation: the full clean prepared HTML remains local and has NOT been written over repository `index.html`; `main` remains untouched. The repository contents connector should not be used to round-trip the full large index file.

## NEXT MILESTONE — exact prepared HTML integration validation
1. Treat `index.modular-clean-regression-checkpoint.html` as the current exact local runtime checkpoint.
2. Update the prepared-HTML validator expectations for the current clean integration shape (53 non-empty inline JavaScript blocks and the required extracted-module dependency order) without mutating the prepared file.
3. Run static validation against the exact clean checkpoint and add targeted regression coverage for the `CALC_LANGS` initialization-order case so it cannot regress.
4. Continue full browser wiring validation, then live Firebase/Cloud, backup/restore, QPay/payment and Android/iOS runtime validation before any controlled merge/release.
5. Do not modify `main` until the controlled merge is separately approved after these validations.

## Handoff rule
Record exact commits, tests actually performed, unresolved risks and exact next step before any integration or release action.
