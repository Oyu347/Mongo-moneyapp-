# Möngö Current Work

Updated: 2026-10-04
Repository: `Oyu347/Mongo-moneyapp-`
Pointer / active working branch: `development-modular`
Verified production lineage: `V44.12.30`

## START HERE — latest handoff

Newest inspected file: **`Mongo-PHONE-TEST-CANCEL-CANONICAL-ROUNDING-V91.html`**.

**V91 is not yet a baseline.** It contains the desired canonical per-lot cancellation rounding, but full inspection found regressions/missing recently PHONE-PASS protections.

### Preserve these PHONE PASS results
- V88 receiver picker = active **Checking only**; no Cash, Savings, inactive account or `Эхний мөнгө`.
- Yearly Budget `Жил тест`, start 2025-03-01: **2026-02 ₮0; 2026-03 ₮192,500**.
- 2026-03-01 actual yearly interest +₮110,000 is planned, not `Төсөвлөөгүй`.
- Yearly cancellation recognizes prior paid interest ₮110,000 and has ₮0 unexplained principal difference.
- Monthly/maturity interest behavior, V84 cancellation-income behavior, one-row mobile Savings actions, and demand-deposit flow remain protected PASS behavior.

### V91 findings
- KEEP: real cancellation Stage3 rounds each lot with `Math.round()` before adding to `allowed`.
- REGRESSION: yearly Budget paths still use `(diff+1)%12===0`, the old off-by-one cycle. Restore passed anniversary-month behavior.
- RESTORE/VERIFY: V91 includes older V40 receiver logic allowing Checking + Cash; passed V88 behavior is Checking-only.
- TEST REQUIRED: canonical rounding is not 4/4 PHONE PASS yet.
- Legacy `interestMode='none'` may remain internally, but normal term-deposit UI must show only the 3 approved interest conditions.

## Target next build
Integrate **V91 canonical rounding + V88 receiver PASS + yearly Budget anniversary-month PASS** without changing unrelated logic. Use a new unambiguous version/name.

## Exact cancellation expectations — Жил тест, cancel 2026-10-04
- Rule 1: allowed ₮61,972; adjustment −₮48,028; fee ₮5,000; receive ₮1,696,972.
- Rule 2: allowed ₮206,576; adjustment +₮96,576; fee ₮5,000; receive ₮1,841,576.
- Rule 3: allowed ₮154,930; adjustment +₮44,930; fee ₮5,000; receive ₮1,789,930.
- Rule 4, bank actual ₮90,000: allowed ₮90,000; adjustment −₮20,000; fee ₮5,000; receive ₮1,725,000.

## Exact next action
Read canonical `docs/CURRENT_WORK.md` first, then create one bounded integrated build. Regression-check receiver picker, February/March yearly Budget, one-row Savings actions, 3 approved interest conditions, and all 4 cancellation-rule totals. Promote only after explicit PHONE PASS.

## Working rule
Never use “newer file” as proof of correctness. Preserve explicit PHONE PASS behavior, record failures/discards, and port only the bounded fix.
