# Möngö — CURRENT WORK

> Canonical startup pointer. Keep synchronized with `docs/modularization/CURRENT_WORK.md`.

Updated: 2026-10-04
Repository: `Oyu347/Mongo-moneyapp-`
Pointer / active working branch: `development-modular`
Verified production lineage: `V44.12.30`

## START HERE — latest handoff

The newest inspected file is **`Mongo-PHONE-TEST-CANCEL-CANONICAL-ROUNDING-V91.html`**.

**Do NOT promote V91 as the new baseline yet.** Full code inspection found that V91 contains the desired canonical cancellation rounding, but it does not preserve every recently PHONE-PASS fix.

### Confirmed PHONE PASS that must be preserved
- V88 receiver picker: new term-deposit separate-interest receiver shows **active Checking accounts only**; excludes Cash, Savings, inactive accounts and `Эхний мөнгө`.
- `Жил тест` yearly Budget cycle: start 2025-03-01 → **2026-02 = ₮0**, **2026-03 = ₮192,500** on current ₮1,750,000 principal at 11%.
- Actual 2026-03-01 `Жил тест · Хүүгийн орлого` +₮110,000 is recognized as planned and no longer shows `Төсөвлөөгүй`.
- Yearly cancellation preview recognizes prior paid interest **₮110,000** and principal/addition history with unexplained balance difference **₮0**.
- Monthly and maturity interest behavior previously passed.
- Cancellation interest classification / actual-only Budget behavior through V84 passed.
- One-row mobile Savings action layout passed.
- Demand-deposit daily/monthly preview and transfer-out flow previously passed.

### V91 inspection result
**Good / keep:**
- Canonical per-lot rounding exists in the real cancellation Stage3 path:
  `i = Math.round(...); allowed += i`.
- This matches the required invariant: round each principal lot to whole ₮ first, then sum.
- Demand-deposit engine and recent cancellation classification code are present.

**Regression / missing protected fixes:**
1. **Yearly Budget cycle regressed.**
   V91 still contains `if(f==='yearly') return (diff+1)%12===0` in two budget paths. For a 2025-03-01 start this is the old off-by-one behavior that can place annual interest in February. The passed behavior is February ₮0 / March ₮192,500.
2. **V88 receiver picker must be restored/verified.**
   V91 visibly contains older V40 receiver eligibility that allows Checking + Cash. The final passed behavior must be Checking-only and must exclude `Эхний мөнгө`.
3. **V91 canonical rounding itself is not yet 4/4 PHONE PASS.**
   Do not mark it passed until all four cancellation rules show 0₮ discrepancy on phone.
4. `interestMode='none'` may remain internally for legacy compatibility, but the normal term-deposit UI must continue to show only the 3 approved interest conditions.

## Current status
V91 is a **candidate integration source, not a baseline**.

Target next build = **V91 canonical rounding + restore V88 receiver PASS + restore yearly Budget anniversary-month PASS**, while preserving all other PHONE-PASS behavior.

Avoid reusing V89 numbering because two different V89 test files existed. Use a new unambiguous version/name for the integrated build.

## Cancellation rounding invariant
For cancellation rules calculated from principal lots:
1. calculate each lot's interest;
2. `Math.round()` that lot to whole ₮;
3. sum the rounded lot amounts;
4. derive adjustment and final receive amount from that exact sum.

### Exact expected `Жил тест` cancellation values (cancel date 2026-10-04)
- Rule 1: allowed **₮61,972**; prior paid **₮110,000**; adjustment **−₮48,028**; fee **₮5,000**; receive **₮1,696,972**.
- Rule 2: allowed **₮206,576**; adjustment **+₮96,576**; fee **₮5,000**; receive **₮1,841,576**.
- Rule 3: allowed **₮154,930**; adjustment **+₮44,930**; fee **₮5,000**; receive **₮1,789,930**.
- Rule 4 with bank actual total interest ₮90,000: allowed **₮90,000**; adjustment **−₮20,000**; fee **₮5,000**; receive **₮1,725,000**.

## Exact next action in a new chat
1. Read this file first.
2. Inspect V91 and the latest PHONE-PASS source/patches for V88 receiver and yearly Budget cycle.
3. Build one bounded integrated file without changing unrelated logic.
4. Regression-check:
   - receiver picker = active Checking only;
   - 2026-02 yearly plan = ₮0;
   - 2026-03 yearly plan = ₮192,500;
   - one-row Savings actions preserved;
   - 3 approved term-deposit interest conditions preserved;
   - cancellation Rule 1–4 values above are exact.
5. Phone-test. Promote only after explicit PHONE PASS.

## Working rule
Every explicit PHONE PASS / PHONE FAIL / discard / rollback is recorded before the next version. Never patch forward merely because a file is newer. Preserve the last proven behavior and port only the bounded change.
