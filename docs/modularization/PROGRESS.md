# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE.

### Audit — Phase 1A: financial invariant findings foundation
Module: `97ca3963494ac942f33c91c994804621c57590b7`
Tests: `ced3c9bfc23cccd3af21aa9a9a51f2aab0439de5`

- Added `src/audit/audit.js` as a pure findings-only cross-feature audit layer. It never mutates or auto-fixes financial data.
- Detects duplicate ledger IDs and expected ledger IDs missing from the unified ledger.
- Detects invalid transfer shape: missing account, same source/destination account, or non-positive amount. Valid Bank↔Cash/internal transfers are not treated as income/expense by this audit.
- Detects ledger references to account IDs that do not exist in the account collection.
- Detects loan-payment ledger rows where total differs from principal + interest + extra principal by more than 1 unit.
- Detects legacy transaction rows carrying `loanPaymentId` as a warning signal for possible loan double representation.
- Adds a conservative Savings warning only when a savings-purpose Expense targets a goal that also has a savings Transfer; no automatic deletion or correction is performed.
- Prepared `index.modular-audit-phase1a.html` and exposed read-only `window.auditMoneyInvariants()` using current accounts, ledger, expected IDs, transfers and transactions.
- Existing `validateUnifiedMoneyLedger()` and `ensureUnifiedMoneyLedger()` behavior remains unchanged; audit is additive/read-only.
- UI/debug rendering and persistence remain inline.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Audit Node regression test file was committed but is not recorded as executed. Browser/runtime parity was not executed.

## Current state
Audit Phase 1A adds a safe read-only invariant layer on top of the unified ledger without changing financial behavior.

## NEXT STEP
### Audit — Phase 1B: account balance and transfer conservation checks
1. Add pure per-account ledger delta calculation and compare it with the existing Core account-balance contract.
2. Add explicit internal-transfer conservation findings: source delta + destination delta must net to zero for the transfer itself.
3. Distinguish invalid/missing account references from conservation failures.
4. Keep opening balances and account start-date semantics aligned with Core; do not duplicate business rules differently.
5. Findings only; no auto-fix, persistence or UI mutation.
6. Add focused regression tests and static syntax validation.

## Future order
Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
