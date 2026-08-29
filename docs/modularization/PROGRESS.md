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

### Loans — Phase 1B
Module `66aa6aeb203fc2ff2eaf41f89a889135d17ca25d`; tests `a2a23dc2df89f0811eda1d9332ddde8af2788b99`.

### Loans — Phase 1C: repayment normalization boundary
Module update: `b287e9c7464483cf409480edb9c954e9a17b99c6`
Regression update: `aeb6ef0255d87a4476f6c126803cd729f66a422b`

- Added `normalizeRepayment()` for pure repayment normalization and validation.
- Preserved the existing tolerance rule: if entered total differs from principal + interest + extra principal by more than 1, total is corrected to the split sum.
- Requires account/date/positive total and rejects principal + extra principal above remaining principal (with the same 1-unit tolerance).
- Prepared `index.modular-loans-phase1c.html` delegates the active V44.05 `saveDebtPayment` repayment object construction/shape validation to `MongoLoans.normalizeRepayment()`.
- Account balance validation remains immediately after normalization and outside Loans.
- Interest mirror expense transaction, payment persistence/remembering, UI close/paint, cloud/save refresh and deletion/edit side effects remain inline.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node loan regression suite and browser/runtime parity are not recorded as executed.

## Current state
Loans owns schedule, principal/interest aggregation, remaining balance, next split and repayment object normalization. Account availability and all mutation/persistence/cross-feature side effects remain compatibility boundaries.

## NEXT STEP
### Loans — Phase 1D: repayment edit normalization + interest mirror boundary audit
1. Inspect exact `saveLoanPaymentEdit()` behavior and delegate only repayment numeric normalization where parity is exact.
2. Preserve old-account credit/new-account debit balance guard during edits.
3. Audit interest mirror transaction update/delete behavior so exactly one interest expense remains linked per payment.
4. Do not move persistence/cloud/render sequencing.
5. Add focused edit regression cases only for pure behavior moved to Loans.
6. Re-run static syntax validation; runtime tests only if actually executed.

## Future order
Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
