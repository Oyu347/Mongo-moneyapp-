# Möngö Current Work

Updated: 2026-09-29
Branch: `development-modular`

## Current PHONE + FORMULA baseline
`Mongo-PHONE-TEST-SAVINGS-OUT-DATE-V49.html`

V49 is the latest user-confirmed baseline for the active demand-savings work. Preserve V36 and all later explicitly passed savings/cancellation/i18n behavior; do not promote an untested newer file.

## Preserve — V49 confirmed
- Demand-deposit UI: no term-only interest-condition/receiver/maturity/early-cancellation-rule fields; annual rate, interest frequency, linked goal and deposit/withdraw permissions remain.
- Estimated-interest card reads real dated balance changes but is display-only; it does not create transactions or mutate balances.
- Savings-out modal has a selectable date, defaults to today, stores the chosen transfer date, and retains seven-language label support.
- Dated opening balance + inbound/outbound transfers formula is PHONE + FORMULA PASS at 6%/365: closing principal ₮1,154,000 and estimate ₮15,762 for the tested 04/10–09/29 history.
- Actual Interest income entries are added to the savings balance and become part of later interest-bearing balance segments. Tested five credits totaling ₮29,140: closing balance ₮1,183,140; estimate ₮16,146. Compound chain PHONE + FORMULA PASS.
- Bank actual credited interest remains source of truth and is recorded through the existing Interest income action. Do not auto-post calculated interest.
- Preserve all earlier cancellation/accounting, bank-expense, linked-goal archive, Cloud safety, transaction grouping and 7-language savings behavior already PHONE PASS.

## Known separate issue
Editing a savings account opening balance can leave the linked savings-goal/history amount stale. Keep this separate from the demand-interest-cycle work.

## Next exact work
Create V50 from the V49 PHONE + FORMULA baseline. Change only the demand-deposit preview period from lifetime accrued interest to the relevant monthly interest cycle. Keep it display-only: no automatic Interest income transaction, no balance mutation, no Firebase/schema change. Then Android PHONE + FORMULA test before promotion.

## Working rule
One bounded change → Android phone test → explicit PHONE PASS → only then promote the baseline. Failed patches are discarded/cleaned rather than stacked.
