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
- Full browser integration was isolated on `integration-full-browser`, including extracted-module wiring and Loan calculator wiring/initialization-order regression coverage. The integration branch reached a fully green checkpoint at `f0d35702d3a6d350b7da0e628653fdf1cde6c5c0`.
- PR #1 (`test: promote full browser integration checkpoint`) was merged into `development-modular` as merge commit `3cd9ea48b1c58254283a30a985d7a3fe44c15e9b`.
- Post-merge workflow run #42 (`33312265566`) completed successfully on `development-modular`: Node regression and every browser regression passed, including full browser wiring and Loan calculator wiring.

## Cloud backup / clear / restore checkpoint — 2026-08-30
- Added deterministic backup/clear/restore/conflict regression on isolated branch `integration-cloud-backup` at commit `35304ead2f4d74fee146721c5145b868d887845b`.
- The isolated branch workflow checkpoint `b9400b55fc784306a2dd0732474cfff3d7a24804` completed successfully in run #44 (`33312963087`).
- PR #2 (`test: promote cloud backup restore checkpoint`) was merged into `development-modular` as merge commit `3b208a36f60a78dc6771b2799343ee513ac13e43`.
- Post-merge run #45 (`33313209772`) completed successfully: both `node-regression` and `browser-module-smoke` were green, including the cloud storage/reset regression and all existing browser financial/subscription wiring checks.
- This checkpoint validates deterministic Cloud ordering, backup/restore selection, clear tombstones/barriers and queue filtering. It does NOT prove a live Firebase backend session, live authentication, network failure/retry behavior, or the exact production `index.html` Firebase runtime wiring.
- No production financial semantics were changed for this checkpoint; `main` remains untouched.

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

## NEXT MILESTONE — exact Firebase runtime wiring, then live-service validation
1. Preserve merge commit `3b208a36f60a78dc6771b2799343ee513ac13e43` plus successful run #45 as the current repository Cloud checkpoint.
2. Treat `index.modular-clean-regression-checkpoint.html` as the current exact local phone-runtime checkpoint; do not replace repository `index.html` through the contents connector.
3. Inspect the exact production Firebase/backup/restore runtime wiring without replacing the large `index.html`; prove the existing driver/function/document-path contract before adding any adapter wiring.
4. After exact wiring is known, validate live Firebase/Cloud behavior separately. Deterministic tests alone do not prove live Firebase.
5. Validate QPay/payment behavior separately; synthetic subscription tests do not prove live payment activation.
6. Validate Android/iOS/Capacitor runtime parity before any release merge.
7. Do not modify `main` until a controlled release merge is separately approved after these validations.

## Handoff rule
Record exact commits, tests actually performed, unresolved risks and exact next step before any integration or release action.

## Cloud Clear/Reset Phase 2 — 2026-08-31
- Live Android phone validation exposed a production-path regression not covered by the earlier deterministic reset test: local financial state reached zero, then stale Cloud mirrors partially resurrected accounts and balances.
- Observed sequence: the device showed all-zero local totals first; about one minute later old account metadata returned without its matching transaction/card graph. The reset verification also surfaced `EMPTY_VERIFY_WRITE_FAILED`.
- Root cause in the runtime contract: compatibility writes treated any one successful Firebase mirror as overall success. That remains acceptable for ordinary best-effort saves, but is unsafe for destructive clear/reset because an unwritten mirror can later win candidate selection.
- Cloud Phase 2 adds an authoritative active local clear barrier that blocks Cloud resurrection until verification releases it.
- Firebase runtime clear now requires all five financial mirrors: `appState`, `financial`, `settings`, `profile`, and `user-root`.
- Clear verification reads every mirror back and requires a current clear marker plus empty financial collections before returning `releaseBarrier: true`.
- Partial reset writes fail with `PARTIAL_CLOUD_MIRROR_WRITE` and list missing paths; the barrier must remain active.
- Commits: Cloud barrier policy `5ad1ad79e53b8d3a37421691df37794134d37e02`; strict runtime clear/verify `a3788eefd12ccd325010e1813e45cd14c82015fb`; regression coverage `a0e463ef4faa553a361115abfc1b27669e6d7ac7`.
- Local Node regression passed: active barrier blocks stale data, verified five-mirror clear succeeds, partial clear rejects, and stale mirrors fail verification.
- Remaining requirement: wait for GitHub Actions on the branch head, then wire the verified Phase 2 driver contract into a new phone checkpoint. Do not reuse the V44.12.8 reset checkpoint and do not modify `main`.

## Safe Delete live Vercel checkpoint — 2026-09-06
- Investigation branch: `fix/safe-delete-all-data`; protected verified lineage remains V44.12.30 and `main` remains untouched.
- Earlier failed Delete timeline was corrected: local data had already been cleared by the hard-reset sequence before Cloud clear failed on missing `getClientId`; the later empty dashboard was therefore not attributed to the helper fix.
- Commit `613b9cc41cbcc981e751555df2b7e6d165b7c2c4` restored stable `getClientId()` in `src/services/cloud/cloud.js`.
- Full runtime inspection identified legacy V43.37 guaranteed financial sync as a bypass: it directly read/wrote `users/{uid}/financial/main` and root fallback independently of the canonical five-mirror/barrier/tombstone path, creating a stale-data resurrection race.
- Commit `07bb506cf98d75e2bb22065f503072526a68ad4f` (`Fix legacy V43.37 direct cloud sync`) disabled the legacy direct single-mirror sync while retaining canonical CloudDataService protections.
- Android local-file smoke test passed: patched runtime opened normally and core UI/navigation rendered normally.
- Safe Vercel Preview startup test passed: refresh + wait did not resurrect old stale data; logout/login also remained empty.
- Controlled live test state: opening balance ₮100,000 + income ₮50,000 - expense ₮10,000 = ₮140,000 current balance.
- User executed Delete All Data; dashboard returned to ₮0 and account/transaction state was removed.
- Subsequent refresh and logout/login remained ₮0; deleted test state did not resurrect.
- User-facing result: **PASS — stale Cloud resurrection was not reproduced after the V43.37 direct-sync fix.**
- This is a user-verified safe-branch/live-Preview checkpoint, not an automatic production promotion. Relevant automated regressions must be confirmed before controlled integration to `development-modular`, and user approval is required before promotion/merge. `main`/production remain untouched.
