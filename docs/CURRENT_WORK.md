# Möngö — CURRENT WORK

> Canonical startup pointer. Keep synchronized with `docs/modularization/CURRENT_WORK.md`.

Updated: 2026-10-01
Repository: `Oyu347/Mongo-moneyapp-`
Pointer / active working branch: `development-modular`
Verified production lineage: `V44.12.30`

## Current PHONE checkpoint
`Mongo-PHONE-TEST-SAVINGS-INTEREST-BUDGET-MATCH-V69.html`

V69 is the last recovered user-confirmed checkpoint for the current combined Budget ↔ Transactions savings-interest work. It is a PHONE working checkpoint, not a production-baseline promotion.

## Preserve
- V51 active savings-transfer target behavior and real internal transfer accounting.
- V55 savings-account lifecycle visibility: no budget rows before opening or after closure.
- V56 selected-month calculated savings-interest plan.
- V59 maturity-only interest row appears only in maturity month.
- V65 maturity-date required guard with seven-language Möngö modal behavior.
- Earlier cancellation/accounting, Cloud/restore, linked-goal, bank-expense, transaction grouping and savings i18n PHONE-PASS protections.

## Current incident
The currently opened app again labels ordinary savings-interest transactions `Төсөвлөөгүй`, although this behavior was PHONE-confirmed as working on V69. Treat this as a regression against V69.

Recovered evidence shows V68 was unsafe because it dropped the V56 monthly-plan block; V69 restored that block and changed `isTxnBudgeted` to match ordinary savings-interest income by the transaction's own month/year and persisted interest-income budget category/subcategory.

No verified V70 PHONE-TEST file was recovered. Do not assume V70 exists.

## Exact next action
Diff the currently served/tested file against V69 around `isTxnBudgeted` plus the V56/V59 blocks. Restore only the missing V69 classification behavior. Android-test multiple savings accounts and months, including a month before account opening. Only after explicit PHONE PASS may a new V70 be created/promoted.

## Working rule
Every explicit PHONE PASS / PHONE FAIL / discard / rollback is recorded immediately before the next version. The 23:00 Asia/Ulaanbaatar closeout is a reconciliation check, not the primary save mechanism.
