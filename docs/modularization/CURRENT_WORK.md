# Möngö Current Work

Updated: 2026-10-01
Branch: `development-modular`

## Current PHONE checkpoint
`Mongo-PHONE-TEST-SAVINGS-INTEREST-BUDGET-MATCH-V69.html`

V69 is the last recovered user-confirmed checkpoint for Budget ↔ Transactions savings-interest classification. Do not promote an untested newer file.

## Preserve
- V51 active savings targets + internal transfer behavior.
- V55 account opening/closure month visibility.
- V56 selected-month calculated interest-income plan.
- V59 maturity-month-only visibility for maturity interest.
- V65 seven-language maturity-date validation.
- All earlier cancellation/accounting, Cloud safety, linked-goal archive, bank-expense mapping, savings i18n and transaction grouping PHONE-PASS behavior.

## Current regression
The currently opened app again shows ordinary savings-interest transactions as `Төсөвлөөгүй`. V69 previously showed the intended planned classification. V68 is not a safe return point because it dropped the V56 monthly-plan block.

No verified V70 PHONE-TEST file is present in the recovered files/docs.

## Next exact work
Compare current served/test file with V69 around `isTxnBudgeted` and V56/V59. Restore only the missing V69 classification behavior; then phone-test multiple months/accounts plus a pre-opening month. Create/promote V70 only after the regression cause is identified and the new file receives explicit PHONE PASS.

## Continuity rule
Record every PHONE result immediately; 23:00 Asia/Ulaanbaatar is the daily reconciliation check. Keep this file synchronized with `docs/CURRENT_WORK.md`.
