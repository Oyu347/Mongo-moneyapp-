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
- Loans Phase 1 COMPLETE through 1E.

### Loans Phase 1 closure
- 1A module `447fdf7116c0aa0a3173c6fac5c26a191927e36c`; tests `a805e8c4ba19cbdeb770db9203ec54004888b5ef`.
- 1B module `66aa6aeb203fc2ff2eaf41f89a889135d17ca25d`; tests `a2a23dc2df89f0811eda1d9332ddde8af2788b99`.
- 1C module `b287e9c7464483cf409480edb9c954e9a17b99c6`; tests `aeb6ef0255d87a4476f6c126803cd729f66a422b`.
- 1D module `1b1ded95131073dd69a3ad5c54e4217784a09607`; tests `9aec8556f639a0911dd8fc067237d412411af83b`.
- 1E closure marker `07944603036691659949f6b2043546b529e83685`.

### Loans — Phase 1E closure audit
- Prepared `index.modular-loans-phase1e.html` preserves Phase 1D behavior; closure adds no speculative monolith mutation.
- Confirmed unified ledger contains distinct `loan_received` and `loan_payment` kinds and delegates funding/payment entry construction to `MongoLedgerCore`.
- Confirmed ledger projection removes compatibility `loanPaymentId` technical interest rows from ordinary transactions, preventing the interest mirror from surviving as a second ordinary expense representation in the projected transaction view.
- Confirmed new/edit repayment normalization remains delegated to `MongoLoans`.
- Loan funding remains a loan/account movement rather than ordinary income; repayment remains unified loan-payment semantics rather than an ordinary expense transaction.
- Asset cross-feature branch remains outside Loans closure and is intentionally untouched.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node loan regression suite and browser/runtime parity are not recorded as executed.

## Current state
Loans Phase 1 is closed. Pure schedule, aggregation, remaining balance, next split, repayment creation/edit normalization are modularized. Ledger owns loan funding/payment accounting semantics; UI/persistence/account availability/cross-feature effects remain compatibility boundaries.

## NEXT STEP
### Savings — Phase 1A: pure savings/goal calculation foundation
1. Inspect exact savings account, goal progress, transfer contribution and interest calculation logic in the latest prepared HTML.
2. Extract only pure savings/goal calculations to `src/features/savings/savings.js`.
3. Preserve the invariant that savings contributions via account transfers are not expenses.
4. Preserve goal-to-savings-account linkage and current compound/payout interest semantics exactly.
5. Keep account transfer mutation, persistence, UI and Budget integration outside the pure module initially.
6. Add focused savings regression tests and run static syntax validation.

## Future order
Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
