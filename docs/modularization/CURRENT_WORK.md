# Möngö Current Work

> Canonical startup pointer. Keep synchronized with `docs/modularization/CURRENT_WORK.md`.

Updated: 2026-10-06
Repository: `Oyu347/Mongo-moneyapp-`
Pointer / active working branch: `development-modular`
Verified production lineage: `V44.12.30`

## START HERE — latest PHONE checkpoint

Current validated phone-test checkpoint: **`Mongo-PHONE-TEST-V88-PICKER-RESTORE-V94.html`**.

**V94 is PHONE PASS for the bounded integration tested on 2026-10-05.** It restores the protected V88 receiver behavior and yearly Budget anniversary behavior while preserving V91 canonical per-lot cancellation rounding.

This is a phone-test checkpoint, not permission to replace production `main` or the verified production lineage.

### V92 / V93 / V94 status
- **V92 — PHONE FAIL / DISCARD.** Receiver picker showed no Checking accounts.
- **V93 — partial PHONE PASS only.** Live Checking accounts appeared, but the placeholder `Данс сонгох` was incorrectly exposed as a selectable row.
- **V94 — PHONE PASS.** Placeholder row removed; real receiver choices remain correct.

### V94 PHONE PASS — protected behavior
1. **Separate-interest receiver picker**
   - User confirmed current Checking accounts `Хаан тест` and `Голомт` appear.
   - Only active Checking accounts are eligible.
   - Cash, Savings, inactive/legacy accounts and `Эхний мөнгө` are excluded.
   - `Данс сонгох` is not a selectable account.
   - Preserve the V88 method: refresh the real native receiver select from live `moneyAccounts` immediately before the mobile custom picker reads `sel.options`.

2. **Yearly Budget anniversary month**
   - Test account `Жил тест`, start 2025-03-01, current principal ₮1,750,000, annual rate 11%.
   - User reconfirmed annual planned interest appears in **March**, not February.
   - Protected exact checkpoint: **2026-02 = ₮0; 2026-03 = ₮192,500**.

3. **Cancellation canonical rounding — 4/4 PHONE PASS**
   Cancel date **2026-10-04**, prior paid interest **₮110,000**, fee **₮5,000**.
   - Rule 1: allowed **₮61,972**; adjustment **−₮48,028**; receive **₮1,696,972**.
   - Rule 2: allowed **₮206,576**; adjustment **+₮96,576**; receive **₮1,841,576**.
   - Rule 3: allowed **₮154,930**; adjustment **+₮44,930**; receive **₮1,789,930**.
   - Rule 4, bank actual total interest ₮90,000: allowed **₮90,000**; adjustment **−₮20,000**; receive **₮1,725,000**.
   - Rule 1 per-lot proof: ₮38,268 + ₮10,672 + ₮4,655 + ₮2,880 + ₮5,497 = ₮61,972.
   - Rule 2 per-lot proof: ₮127,562 + ₮35,573 + ₮15,518 + ₮9,600 + ₮18,323 = ₮206,576.
   - Rule 3 per-lot proof: ₮95,671 + ₮26,679 + ₮11,638 + ₮7,200 + ₮13,742 = ₮154,930.
   - Invariant: calculate each principal lot, `Math.round()` each lot to whole ₮, then sum.

4. **Cancellation reconciliation**
   - Current principal ₮1,750,000.
   - Opening principal ₮1,000,000 + additions ₮750,000.
   - Prior separate-account interest ₮110,000 recognized.
   - Unexplained balance difference = **₮0**.

### Still protected from earlier PHONE PASS
Do not regress monthly/maturity interest behavior, planned yearly-interest transaction classification, one-row mobile Savings actions, 3 approved normal term-deposit interest conditions, demand-deposit preview/transfer flow, seven-language UI, Cloud/data safety, transfers or Budget integrations.

## Baseline rule
Use **V94 as the latest validated phone-test checkpoint for this active savings/cancellation work**. Do not patch forward from V92/V93 or the failed rounding V89. A later version replaces V94 only after explicit phone testing.

Do not promote V94 to production `main` merely because this bounded test passed.

## Exact next action
Before the next feature/fix:
1. start from V94 or reconstruct exactly from its recorded bounded changes;
2. verify the protected PASS list above is still present;
3. make only the next bounded change;
4. record PHONE PASS/FAIL before creating another version.


## 2026-10-06 — Savings interest / cancellation closeout
- Receiver picker remains PHONE PASS: live active Checking accounts only; placeholder excluded.
- Savings `+ Хүүгийн орлого` is PHONE PASS and is correctly placed in the compact one-row action layout. Do not add a generic `+ Орлого нэмэх` action; principal additions remain Transfers.
- New clean term-deposit cancellation tests PHONE PASS for all 4 rules, including simple-interest handling and dated principal additions.
- Existing complex `Жил тест` 4-rule cancellation checkpoint remains protected and PHONE PASS.
- Real cancellation was completed successfully on phone on 2026-10-06. The app transferred **₮2,404,600** to the selected receiving account.
- Cancellation reconciliation matched history before confirmation; the confirmation guard correctly blocked cancellation while the intentionally future-dated ₮10,000 test transaction made the test history inconsistent.
- After deleting that artificial future-dated test transaction, real cancellation succeeded.
- Decision: **do not pursue a future-dated-transaction cancellation patch now.** Entering not-yet-earned future income as a real transaction is not the intended normal workflow, and the reconciliation guard is useful protection against inconsistent history.
- V95D was a presentation-only stabilization of the maturity-account action row. It did not change financial, Budget, cancellation, transaction or persistence logic. Its action-row layout passed, but it must not be interpreted as proof that every later cancellation state was already resolved.
- V95E requires a narrower status than the earlier note implied. The future-dated-transaction reconstruction idea in V95E is **NOT promoted** and is no longer a next action. However, V95E must **not** be treated as a wholly failed/discarded build: phone testing later reached an enabled real-cancellation path and completed a real cancellation successfully after the artificial future-dated ₮10,000 test entry was removed.
- Therefore do not use the V95E future-date reconstruction change as a baseline. At the same time, preserve the independently PHONE-PASS cancellation behavior demonstrated in that test lineage.
- Preserve: cancellation per-lot rounding, all 4 rules, simple/compound behavior, receiver picker, yearly Budget anniversary behavior, `+ Хүүгийн орлого`, compact one-row actions, 7 languages, transfers and data safety.

## Current status / next action
The active Savings cancellation test cycle is **CLOSED / PHONE PASS for the intended workflow**. Before any new code change, review the remaining Savings backlog and choose one still-unfinished item. Do not rework the future-dated test case unless the product later intentionally supports posting future income as a real transaction.


## 2026-10-07 — V100 staged cancellation calculator stability PHONE PASS
- Source: exact conversation V95E source; V99's broad lifecycle stabilizer was not carried forward.
- V100 changed only the existing Rule 2 staged-calculator lifecycle: if the cancellation calculator rebuilds its DOM and the existing tier node disappears, the existing V95E staged UI is reinstalled. No duplicate tier UI/formula was added.
- PHONE PASS: `Үе шаттай хүү бодох` remains visible/stable after the prior disappear/reappear failure.
- PHONE PASS: existing four editable tiers remain visible: 0–89 = 2.4%, 90–179 = 4%, 180–364 = 6%, 365+ = 8%.
- Regression check: the calculator's other expected fields remained visible in the user's phone test; the earlier V99 UI regression was not observed.
- Status: **V100 PHONE PASS for this bounded staged-visibility fix only.** This does not promote production/main and does not supersede the protected financial PHONE-PASS checkpoints without their own regression tests.
- Separate remaining display issue: literal `\\n\\n` is visible at the bottom of the page. Treat it as presentation-only and fix separately; do not mix it with cancellation formulas or data logic.
