# Möngö Current Work

> Canonical startup pointer. Keep synchronized with `docs/modularization/CURRENT_WORK.md`.

Updated: 2026-10-05
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
