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

### Loans — Phase 1C
Module `b287e9c7464483cf409480edb9c954e9a17b99c6`; tests `aeb6ef0255d87a4476f6c126803cd729f66a422b`.

### Loans — Phase 1D: repayment edit normalization + interest mirror audit
Module update: `1b1ded95131073dd69a3ad5c54e4217784a09607`
Regression update: `9aec8556f639a0911dd8fc067237d412411af83b`

- Added `normalizeRepaymentEdit(existing,input,currentRemaining)`; it preserves stable payment id/createdAt and allows the edited payment's old principal + extra principal back into the maximum editable principal before validating the replacement.
- Prepared `index.modular-loans-phase1d.html` delegates numeric edit validation/normalization from `saveLoanPaymentEdit()` to `MongoLoans.normalizeRepaymentEdit()`.
- Preserved account edit balance semantics: if the account is unchanged, old total is credited back for the balance guard; if account changes, no credit is applied to the new account.
- Interest mirror boundary audited and left inline: positive interest updates the existing linked technical row or creates one if missing; zero interest removes rows linked by `loanPaymentId`.
- Persistence/cloud/render sequencing remains inline and unchanged.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node loan regression suite and browser/runtime parity are not recorded as executed.

## Current state
Loans owns schedule, aggregation, remaining balance, next split, new repayment normalization and repayment-edit normalization. Account balance, interest mirror mutation, persistence and UI remain compatibility boundaries.

## NEXT STEP
### Loans — Phase 1E: closure audit
1. Audit loan creation/funding and repayment/delete/edit boundaries against ledger invariants.
2. Confirm loan received into an account is not income and repayment is not duplicated as ordinary expense.
3. Confirm interest is represented once in the unified loan-payment semantics even though compatibility technical rows may exist before ledger projection.
4. Do not migrate asset purchase/funding cross-feature behavior in Loans closure.
5. If no additional low-risk pure boundary remains, mark Loans Phase 1 COMPLETE and move to Savings Phase 1A.
6. Re-run static syntax validation; runtime tests only if actually executed.

## Future order
Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
