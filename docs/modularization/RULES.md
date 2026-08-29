# Möngö Modularization Rules

These rules are mandatory while splitting the monolithic app.

1. Work only on `development-modular` during modularization. Do not modify `main` as part of these phases.
2. Preserve current user-visible and financial behavior unless a separately approved bug fix is being made.
3. Prefer compatibility wrappers first; migrate callers incrementally.
4. One bounded phase should have its own commit(s) with a clear message.
5. Never replace the large `index.html` from an incomplete/truncated source. Use the exact latest working file when a full-file replacement is required.
6. Before deleting legacy code, prove the modular replacement is loaded, called, and regression-tested.
7. Financial invariants have priority over refactoring elegance.
8. Transfers are internal money movement: source decreases, destination increases, total money/net worth and income/expense totals must not change solely because of the transfer.
9. Cash is a first-class account/location. Bank ↔ Cash movement is a transfer, not an expense/income.
10. Account balances should converge on the unified ledger as the source of truth.
11. Loan repayments must preserve principal/interest semantics and account-balance effects.
12. Savings contributions routed between money accounts must not become duplicate expenses.
13. Cloud synchronization must never silently overwrite newer valid local financial data with stale data.
14. Clear/reset must remove the intended local/cloud financial mirrors without recreating deleted state from a pending queue.
15. Seven-language behavior must remain intact during extraction; do not hard-code one language/currency into shared financial logic.
16. Currency symbols and formatting are presentation/locale concerns; raw financial calculations should remain numeric.
17. Run syntax checks after code extraction and run targeted financial regression tests for the affected module.
18. Update `PROGRESS.md` after each completed phase, including commits, tests, known risks, and the next step.

## Minimum regression questions

- Did total money change when it should not?
- Did an account balance change by exactly the expected amount?
- Did income/expense totals change only for real income/expense?
- Did loan principal and interest remain correctly separated?
- Did savings/goal progress avoid double counting?
- Does refresh/re-login preserve the same result?
- Does cloud sync preserve the same result across sessions/devices?
- Do all seven languages still load without breaking the feature?