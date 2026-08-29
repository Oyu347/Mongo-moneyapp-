# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Baseline
Use the exact latest prepared V44 full HTML; never reconstruct the monolith from truncated GitHub contents.

## Completed
- Storage Phase 1 compatibility foundation.
- Core Phase 1 COMPLETE.
- Accounts Phase 1 COMPLETE through 1E.
- Transactions Phase 1 COMPLETE through 1E.

### Loans — Phase 1A
Module `447fdf7116c0aa0a3173c6fac5c26a191927e36c`; tests `a805e8c4ba19cbdeb770db9203ec54004888b5ef`.
Pure loan schedule/payment calculation foundation created; standalone schedule caller delegated.

### Loans — Phase 1B: remaining balance + next split migration
Module update: `66aa6aeb203fc2ff2eaf41f89a889135d17ca25d`
Regression update: `a2a23dc2df89f0811eda1d9332ddde8af2788b99`

- Added pure `paidAmount(debt, legacyPrincipalPaid)` so modern principal + extra principal can be combined with legacy principal history without treating interest as principal reduction.
- Prepared `index.modular-loans-phase1b.html` delegates modern principal/total/interest aggregation, opening remaining, mixed-history paid amount, remaining principal and next-payment split through `MongoLoans` compatibility wrappers.
- Legacy loan payment detection remains in the monolith because it depends on transaction classification/history; only its numeric principal result is passed to the pure Loans module.
- Interest alone does not reduce remaining principal; extra principal does.
- `saveDebtPayment()` mutation, account balance guard, interest-expense mirror transaction, linked asset flow and persistence/UI remain inline.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node loan regression suite and browser/runtime parity are not recorded as executed.

## Current state
Loans owns schedule calculation, modern payment aggregation, opening/remaining principal and next-payment principal/interest split. Legacy transaction classification and all repayment side effects remain compatibility boundaries.

## NEXT STEP
### Loans — Phase 1C: repayment object construction + validation boundary
1. Extract pure repayment normalization/validation for account/date/total/principal/interest/extra-principal without moving persistence.
2. Preserve the existing rule that displayed total is corrected to principal + interest + extra principal when mismatch exceeds tolerance.
3. Reject principal + extra principal above remaining balance exactly as the current caller does.
4. Keep account-balance availability validation outside the pure Loans module because it depends on Accounts/Ledger.
5. Keep interest mirror expense creation and loan-payment deletion side effects inline until separately migrated.
6. Add regression coverage and run static syntax validation; runtime tests only if actually executed.

## Future order
Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
