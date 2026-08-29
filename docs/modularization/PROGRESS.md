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

### Loans — Phase 1A: pure calculation foundation
Module: `447fdf7116c0aa0a3173c6fac5c26a191927e36c`
Tests: `a805e8c4ba19cbdeb770db9203ec54004888b5ef`

- Created `src/features/loans/loans.js` with pure payment aggregation, opening/remaining principal, next-payment principal/interest split and full schedule calculation.
- Preserved existing `annuity` and `diff` formulas from the prepared V44 HTML, including extra-principal schedule behavior and the 1000-iteration guard.
- Remaining principal subtracts principal + extra principal, not interest; optional legacy principal-paid input keeps old transaction migration outside the pure module.
- Added regression cases for payment aggregation, opening/remaining balance, zero-interest annuity, declining equal-principal payment, annuity payoff, extra-payment benefit and next-split principal/interest values.
- Prepared `index.modular-loans-phase1a.html` loads Loans after Transactions and delegates the standalone `buildLoanSchedule()` compatibility wrapper to `MongoLoans.buildSchedule()`.
- Debt creation, repayment persistence, interest-expense mirror transaction, account balance guard, linked asset purchase and legacy loan-payment transaction detection remain inline.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node loan regression suite and browser/runtime parity are not recorded as executed.

## Current state
Loans Phase 1 has a pure calculation foundation. Only the standalone schedule calculator caller is delegated so far; debt remaining/next-split compatibility callers remain inline until legacy-payment semantics are wired explicitly.

## NEXT STEP
### Loans — Phase 1B: remaining balance + next payment split caller migration
1. Delegate modern payment aggregation to `MongoLoans` while preserving legacy transaction-based principal additions exactly.
2. Migrate `getDebtOpeningRemaining()`, `getDebtRemaining()` and `debtCalcNextSplit()` through compatibility wrappers without changing UI behavior.
3. Verify interest is never subtracted from principal balance and extra principal is.
4. Keep `saveDebtPayment()` mutation, interest expense mirror transaction and account balance validation inline.
5. Extend regression coverage for mixed modern + legacy principal history and extra principal.
6. Re-run static syntax validation; execute runtime/Node tests only if actually run.

## Future order
Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
