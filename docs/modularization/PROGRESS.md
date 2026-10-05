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

## Phone working checkpoint — 2026-09-26
- Current PHONE-PASS baseline for the active single-file app work: `Mongo-PHONE-TEST-SAVINGS-INTEREST-I18N-SAFE-V36.html`.
- V37 transaction-history patch is DISCARDED / DO NOT USE. The apparent missing older transactions were caused by the Transactions date filter; V36 already shows 2026 → month groups correctly under `Бүгд / All`.
- Closed savings cancellation regression fixed and phone-confirmed before V36: legacy cancelled account `Ком` now closes at ₮0; the erroneous -₮200,000 duplicate/non-cash interest-adjustment effect is removed; closed accounts no longer show `Хадгаламж цуцлах` or `+ Хүүгийн орлого` actions; financial consistency indicator returned to ✓.
- Real cancellation flow phone-confirmed: principal settlement, allowed-interest adjustment, bank fee, receiving-account movement and linked-goal archive remain separate. Principal transfer is not income; cancellation fee is bank expense; interest clawback/adjustment must not be double-counted as a second cash outflow.
- Bank expense mapping phone-confirmed: internal key `bank_expense` displays as localized Bank expense and cancellation fees contribute to its budget actual without changing the internal key.
- Savings interest entry V34→V36: `+ Хүүгийн орлого / + Interest income` prefills a calculated amount from current savings balance + contract annual rate + payout frequency, but the user may edit it to the bank's actual credited amount before Save. This is a preview/prefill workflow, not unattended automatic posting.
- V36 i18n PHONE PASS for the savings action buttons and Interest income modal. Preserve mn/en/zh/ja/ko/ru/de and do not restore the earlier whole-document MutationObserver translation patch.
- Transaction history behavior: preserve existing year/month collapsible grouping. Older interest-income entries are visible when the date filter is `Бүгд / All`; do not reimplement this behavior.
- Regression rule for every next phone patch: start from V36 unless a newer version is explicitly PHONE PASS; preserve Cloud serialization/restore safety, closed-account fixes, cancellation rules, linked-goal archive, bank-expense mapping, seven-language savings UI, interest prefill, and Transactions year/month grouping.
- Avoid patch stacking. If a patch fails, return to the last PHONE-PASS baseline and port only the required fix; remove failed diagnostic/migration patches rather than carrying them forward.


## Demand savings PHONE + FORMULA checkpoint — 2026-09-29
- New user-confirmed phone/formula baseline for the active demand-savings work: `Mongo-PHONE-TEST-SAVINGS-OUT-DATE-V49.html`.
- V45B demand-savings UI PHONE PASS: demand deposits hide term-only interest-mode/receiver/maturity/cancellation-rule UI; keep annual rate, interest frequency, linked goal, additional-deposit permission and money-withdrawal permission.
- V47A preview-card placement PHONE PASS. V47 failed to mount and is discarded.
- V48 real-data preview PHONE PASS: estimated interest reads opening balance, dated inbound/outbound transfers and balance-affecting interest-income entries without writing money or transactions.
- V49 PHONE PASS: Savings → Transfer from savings now includes a selectable date (defaults to today) and saves that selected date into the transfer record; seven-language date label preserved.
- V49 FORMULA PASS on Android: opening ₮20,000; +₮100,000 (05-08); +₮150,000 (06-19); -₮10,000 (07-15); +₮350,000 (07-30); +₮1,000,000 (08-19); -₮456,000 (09-29) produced closing principal ₮1,154,000 and estimated 6% interest ₮15,762 for 04-10→09-29 using the current 365-day dated-balance convention.
- Compound-interest chain PHONE + FORMULA PASS: actual interest-income entries ₮5,770 (05-11), ₮5,799 (06-11), ₮5,828 (07-11), ₮5,857 (08-11), ₮5,886 (09-11) total ₮29,140; closing balance becomes ₮1,183,140 and estimated accrued interest becomes ₮16,146. The credited interest is included in later balance segments, so the compound principle works.
- Preview remains estimate-only: do not auto-post interest, do not mutate balance, and treat the bank's actual credited interest as source of truth via the existing Interest income action.
- Known separate issue discovered during testing: editing a savings account opening balance can leave linked savings-goal/history amounts stale. Do not mix that repair into the interest-cycle patch.
- Next exact bounded task: V50 should change the demand-savings preview from lifetime accrued interest to the relevant monthly interest cycle while preserving V49 financial behavior. First version remains display-only; no automatic Interest income posting and no schema/Firebase changes.


## Phone work recovery checkpoint — 2026-10-01

This section reconstructs the missing continuity record from the retained phone-test evidence and local PHONE-TEST files. It does not promote an untested file.

### Confirmed / preserved sequence
- V50 `Mongo-PHONE-TEST-DEMAND-MONTHLY-CYCLE-V50.html`: demand-deposit estimated-interest preview moved to the relevant monthly cycle; display-only. PHONE + FORMULA behavior was confirmed before later work.
- V51 `Mongo-PHONE-TEST-SAVINGS-ACTIVE-TARGETS-V51.html`: active savings accounts remain selectable as savings-transfer targets even when linked-goal metadata is stale. Later phone evidence confirmed the target picker and a real ₮10,000 savings transfer; the receiving savings balance/history updated and the transfer remained an internal movement.
- V55 lifecycle behavior is preserved in the later files: savings-interest budget rows are excluded before the savings account opening month and after closure, while the opening/closing month remains eligible. Phone evidence on 2026-10-01 reconfirmed that January no longer showed later-opened savings accounts and the normal budget screen remained intact.
- V56 selected-month interest-income plan behavior is preserved in V69: calculated savings interest is generated from the selected month/account data rather than manual guessing. Do not remove this block while repairing transaction classification.
- V59 maturity-interest budget behavior: an account using “interest at maturity” is hidden from interim zero months and appears with calculated interest in its actual maturity month. PHONE PASS.
- V60→V62 established required maturity date + Möngö modal + seven-language guard. Later V63→V65 rewrote the guard more narrowly around the actual account save paths; V69 contains the V65 guard. The exact intermediate V63/V64 evidence is not promoted separately.
- V66→V69 investigated Transactions → savings-interest “Төсөвлөсөн / Төсөвлөөгүй” classification. V66 used a wrapper fallback; V67 moved matching into `isTxnBudgeted`; V68 accidentally dropped the V56 monthly-plan block and is therefore not a safe baseline; V69 restored V56/V59 behavior and matched ordinary savings-interest income against the transaction month/year and its persisted interest-income budget category/subcategory.
- User phone evidence confirmed V69 had the intended “Төсөвлөсөн” result for savings-interest transactions while the pre-opening budget-row regression was also corrected. Treat V69 as the last known good checkpoint for this combined area.
- No verified `V70` PHONE-TEST HTML is present in the recovered runtime files or continuity docs. Do not assume V70 exists or is a baseline.

### Current regression / incident
- On 2026-10-01 the currently opened app again showed ordinary savings-interest transactions as `Төсөвлөөгүй`, even though the user recalls and phone evidence confirms this was working on V69.
- This is a regression against the V69 behavior, not permission to redesign the budget formula.
- Preserve: V55 account lifecycle visibility, V56 calculated monthly interest plan, V59 maturity-month visibility, V65 seven-language maturity-date validation, V51 transfer behavior, and all earlier cancellation/accounting protections.

### Exact next action
Compare the currently served/tested file against `Mongo-PHONE-TEST-SAVINGS-INTEREST-BUDGET-MATCH-V69.html` specifically around `isTxnBudgeted` and the V56/V59 interest-plan blocks. Restore only the missing V69 classification behavior, then Android-test several months/accounts. Do not create/promote V70 until V69 state is recorded and the regression cause is identified.


## Daily phone-work closeout — 2026-10-04

This section records the 2026-10-04 Möngö savings work from the active chat. It is a continuity record; it does not promote production `main`.

### Product / formula decisions
- Term-deposit normal interest conditions remain 3: compound into savings; pay interest to a separate account; pay at maturity. Legacy `interestMode='none'` may remain internally for compatibility but is not a normal user-facing term-deposit condition.
- User-facing interest payout frequency direction: remove/hide `Улирал бүр` from the normal term-deposit UI; retain `Сар бүр`, `Жил бүр`, and `Хугацааны эцэст`. Quarterly legacy compatibility must not be destructively removed as part of an unrelated patch.
- Cancellation accounting principle: do not create 12 separate handwritten cancellation formulas. Reconcile the total interest allowed by the selected cancellation rule against interest already actually paid/capitalized.
- Whole-tugrik rounding invariant: calculate each principal lot's cancellation interest and `Math.round()` that lot first, then sum the rounded lots. Do not sum fractional lot interest and round only at the end.

### Receiver-account picker
- V86 `Mongo-PHONE-TEST-NEW-SAVINGS-RECEIVER-V86.html`: PHONE FAIL / DISCARD. The new-savings receiver popup used the wrong account source and rendered empty.
- V87 `Mongo-PHONE-TEST-NEW-SAVINGS-RECEIVER-V87.html`: PHONE FAIL / DISCARD. The popup still exposed only the legacy `Эхний мөнгө` option.
- V88 `Mongo-PHONE-TEST-CHECKING-RECEIVER-V88.html`: PHONE PASS. For `Хүүг тусдаа дансанд авах`, the new-account popup refreshes immediately before the mobile custom picker reads it and shows active Checking accounts only. Cash, Savings, inactive accounts and `Эхний мөнгө` are excluded. User confirmed the two current checking accounts appeared.

### Yearly-interest test account
Test account `Жил тест`:
- Term deposit; separate-account interest; annual rate 11%; payout frequency yearly; receiver `Голомт`; start 2025-03-01.
- Opening principal ₮1,000,000.
- Added savings transfers: 2025-04-11 ₮300,000; 2025-06-19 ₮150,000; 2025-07-23 ₮100,000; 2025-08-12 ₮200,000. Total additions ₮750,000; current principal ₮1,750,000.
- Actual first yearly interest transaction entered for 2026-03-01: +₮110,000 to `Голомт`.

### Yearly cancellation preview validation
Cancellation preview date: 2026-10-04. Principal ₮1,750,000. Previously paid separate-account interest correctly classified as ₮110,000. No interest capitalized into the savings account. Additions reconcile exactly; unexplained balance difference = ₮0.
- Rule 1 reduced-rate 2.4%: per-lot display ₮38,268 + ₮10,672 + ₮4,655 + ₮2,880 + ₮5,497 = expected allowed interest ₮61,972. A later screen exposed a ₮1 aggregation regression: adjustment -₮48,027 / receive ₮1,696,973 instead of invariant-correct -₮48,028 / ₮1,696,972. Therefore Rule 1 is NOT final PASS yet.
- Rule 2 staged-rate preview: 365+ tier 8%; displayed lot results ₮127,562 + ₮35,573 + ₮15,518 + ₮9,600 + ₮18,323 = ₮206,576; adjustment +₮96,576; fee ₮5,000; receive ₮1,841,576. Preview matched the expected screen.
- Rule 3 threshold preview: 365-day threshold, after-threshold 6%; displayed lot results ₮95,671 + ₮26,679 + ₮11,638 + ₮7,200 + ₮13,742 = ₮154,930; adjustment +₮44,930; fee ₮5,000; receive ₮1,789,930. Preview matched.
- Rule 4 bank actual: entered final bank-allowed total interest ₮90,000; prior paid ₮110,000; adjustment -₮20,000; fee ₮5,000; receive ₮1,725,000. Preview matched.
- No destructive real cancellation was executed. Preview validation is not permission to mark the final cancellation mutation flow PASS.

### Yearly Budget cycle
- A regression placed `Жил тест` yearly planned interest in February for a 2025-03-01 start date. Root cause was an off-by-one yearly month-cycle condition.
- V89 yearly-budget-cycle patch corrected the anniversary placement. User phone-confirmed 2026-02 `Жил тест` = ₮0 and 2026-03 `Жил тест` = ₮192,500.
- ₮192,500 is correct for the current estimator design because current principal ₮1,750,000 × 11% = ₮192,500. March total interest-income plan displayed ₮209,583 = Business ₮10,833 + Аялал ₮6,250 + Жил тест ₮192,500.
- YEARLY BUDGET CYCLE: PHONE PASS.
- Transactions follow-up: the actual 2026-03-01 `Жил тест · Хүүгийн орлого` +₮110,000 no longer displayed `Төсөвлөөгүй`. Budget ↔ transaction classification for this yearly test: PHONE PASS. The actual bank credit may differ from the calculated plan; do not force the actual to equal the plan.

### Failed rounding patch / regression incident
- `Mongo-PHONE-TEST-CANCEL-ROUNDING-V89.html`: PHONE FAIL / DISCARD / DO NOT USE AS BASELINE.
- It attempted to restore the whole-tugrik per-lot cancellation rounding rule, but it was created from an older/stale source lineage rather than the latest fully preserved phone checkpoint.
- Phone regression evidence: the Savings actions `Хадгаламж цуцлах` and `+ Хүүгийн орлого`, which had previously fit on one row, regressed to two rows. This proves the patch did not preserve all later UI work.
- File size was not the root issue: the source materialized during the patch was 1,978,984 bytes and the generated file was about the same size. The problem was lineage/source selection, not simple truncation.
- Do not patch forward from this failed file. Return to the latest fully preserved PHONE-PASS lineage and port only the rounding change.

### Protected PASS state after today's work
Preserve all of the following before the next cancellation patch:
1. V88 active Checking-only interest receiver picker.
2. Yearly prior-paid interest recognition of ₮110,000.
3. 2026-02 yearly plan = ₮0 and 2026-03 yearly plan = ₮192,500 for `Жил тест`.
4. 2026-03-01 +₮110,000 yearly-interest transaction is treated as planned (no `Төсөвлөөгүй` badge).
5. Existing monthly and maturity interest behavior.
6. Existing cancellation accounting/history classification and zero unexplained balance difference.
7. Existing one-row mobile Savings action-button layout.
8. Seven-language UI, Cloud/data, transfer, Budget and other earlier PHONE-PASS behavior.

### Continuity incident and rule
The canonical pointers had not been updated after the 2026-10-01 checkpoint, so today's work existed in chat/files without a synchronized GitHub continuity record. This stale-pointer state contributed to selecting an older source for the rounding patch.
From now on, before creating V(N+1), record V(N)'s PASS/FAIL/DISCARD state and verify the source file contains the latest protected PHONE-PASS behaviors. A financial fix must not be accepted if an unrelated UI/function regresses.

### Exact next action
Do NOT modify the failed `Mongo-PHONE-TEST-CANCEL-ROUNDING-V89.html`.
First identify/recover the exact latest full PHONE-PASS source that contains V88 receiver behavior + yearly Budget cycle PASS + planned yearly transaction classification + one-row Savings action buttons. Compare it against the failed rounding file. Then port only the previously validated per-lot whole-tugrik rounding invariant into that source. Regression-check protected items before giving the user a new phone-test file. Test all 4 cancellation rules and require 0₮ discrepancy before promotion.


## V94 integrated savings/cancellation PHONE checkpoint — 2026-10-05
- V92 integrated attempt: **PHONE FAIL / DISCARD**. Receiver picker rendered no Checking accounts; do not use as baseline.
- V93 restored the successful V88 timing strategy: refresh the real native receiver select from live `moneyAccounts` immediately before the mobile custom picker reads `sel.options`. User confirmed `Хаан тест` and `Голомт` appeared, but the placeholder `Данс сонгох` was also selectable. Therefore V93 is only partial PASS and is superseded.
- V94 removed the placeholder from the selectable receiver options without changing the V88 live-picker timing. User confirmed only real Checking accounts appear. **Receiver picker PHONE PASS.**
- Yearly Budget anniversary behavior reconfirmed on V94: `Жил тест` annual plan appears in March, not February. Protected exact values remain 2026-02 ₮0 and 2026-03 ₮192,500. **PHONE PASS.**
- Canonical cancellation rounding was phone-tested on 2026-10-04 cancel date and passed all four rules:
  - Rule 1: ₮61,972 allowed; −₮48,028 adjustment; ₮5,000 fee; ₮1,696,972 receive.
  - Rule 2: ₮206,576 allowed; +₮96,576 adjustment; ₮5,000 fee; ₮1,841,576 receive.
  - Rule 3: ₮154,930 allowed; +₮44,930 adjustment; ₮5,000 fee; ₮1,789,930 receive.
  - Rule 4 with bank actual total interest ₮90,000: −₮20,000 adjustment; ₮5,000 fee; ₮1,725,000 receive.
- Per-lot rounding invariant is now **4/4 PHONE PASS**: round each principal lot to whole ₮ before summing.
- Cancellation reconciliation also remained correct: opening ₮1,000,000 + additions ₮750,000 = current principal ₮1,750,000; prior paid separate-account interest ₮110,000 recognized; unexplained balance difference ₮0.
- No destructive real cancellation was required for these preview/formula checks.
- **Latest active phone-test checkpoint for this bounded work: `Mongo-PHONE-TEST-V88-PICKER-RESTORE-V94.html`.**
- Do not treat this checkpoint as an automatic production/main promotion. Preserve all earlier protected PASS behavior and require explicit phone validation for subsequent versions.
