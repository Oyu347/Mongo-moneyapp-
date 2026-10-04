# Möngö Current Work

Updated: 2026-10-04
Repository: `Oyu347/Mongo-moneyapp-`
Pointer / active working branch: `development-modular`
Verified production lineage: `V44.12.30`

## Current phone state
Today's yearly-interest Budget work is PHONE PASS, but the latest cancellation-rounding test file is PHONE FAIL / DISCARD.

### Confirmed PHONE PASS
- V88 `Mongo-PHONE-TEST-CHECKING-RECEIVER-V88.html`: new term-deposit separate-interest receiver picker shows active Checking accounts only; excludes Cash, Savings, inactive accounts and `Эхний мөнгө`.
- `Жил тест` yearly Budget cycle: start 2025-03-01 → 2026-02 planned interest ₮0; 2026-03 planned interest ₮192,500 on current ₮1,750,000 principal at 11%. PHONE PASS.
- Actual 2026-03-01 `Жил тест · Хүүгийн орлого` +₮110,000 is now recognized as planned and no longer shows `Төсөвлөөгүй`. PHONE PASS.
- Yearly cancellation preview correctly recognizes prior paid interest ₮110,000 and principal/addition history with unexplained balance difference ₮0.

### Current FAIL / DISCARD
`Mongo-PHONE-TEST-CANCEL-ROUNDING-V89.html` — PHONE FAIL / DISCARD / DO NOT USE AS BASELINE.

Reason: it was built from a stale/older source lineage. The previously working one-row mobile Savings actions (`Хадгаламж цуцлах` + `+ Хүүгийн орлого`) regressed to two rows. File size was not the cause; source lineage was.

Rule 1 also exposed the outstanding rounding issue: displayed rounded lots total ₮61,972, so with prior paid ₮110,000 and fee ₮5,000 the invariant-correct adjustment/receive values are -₮48,028 and ₮1,696,972. The current calculation path showed -₮48,027 / ₮1,696,973.

## Preserve before next patch
- V88 receiver picker PASS.
- Yearly prior-paid-interest recognition.
- Yearly Budget anniversary-month PASS and yearly transaction planned classification.
- Monthly and maturity interest behavior.
- Cancellation history classification and zero unexplained balance difference.
- One-row Savings action-button layout.
- Seven-language UI, Cloud/data, transfers, Budget and all earlier PHONE-PASS protections.

## Rounding invariant
For cancellation rules that calculate interest from principal lots, calculate each lot's interest, round that lot to whole ₮ with `Math.round()`, then sum the rounded lots. Do not sum fractional lot interest and round only at the end.

## Exact next action
Do not patch forward from the failed rounding file. Recover/identify the exact latest full PHONE-PASS source containing V88 + yearly Budget/transaction PASS + one-row Savings actions. Port only the per-lot rounding invariant into that source. Regression-check protected behavior, then phone-test all four cancellation rules. Require 0₮ discrepancy before promotion.

## Working rule
Every explicit PHONE PASS / PHONE FAIL / discard / rollback is recorded before the next version. Never create the next patch from a file merely because it is newer or conveniently available; verify it contains the latest protected PHONE-PASS behavior first.
