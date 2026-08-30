# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE.

### Budget — Phase 1A
Module `fbe83463ee53f97fbed1e39eb44dc50b51da5558`; tests `d3def27de72eeead47627d98fa7423af7a9af8c4`.

### Budget — Phase 1B: Transfer-backed actual progress
Module: `7787ee7607c9c9f4943066c71186e94d1ebeac2f`
Tests: `ca0e38835e0af5947b6887b1c48196d0cc032743`

- Active `gSpent()` compatibility layer now delegates resolved Savings goal actuals to `MongoBudget.savingsGoalActual()`.
- Savings goal actual remains Savings Transfers plus credited savings interest. Ordinary/legacy Savings Expense is not added again in the goal-source path.
- Resolved loan source actual delegates to `MongoBudget.loanActual()` and remains total cash payment (`payment.total`) for Budget progress; principal/interest accounting elsewhere is unchanged.
- Eligible investment parent and individual investment source actuals delegate to `MongoBudget.investmentActual()` after caller-side identity resolution.
- Investment actual accepts only `purpose:'investment'` or `purpose:'asset'` rows matching eligible target/asset identities; internal transfers do not count.
- Category/source discovery, eligibility rules, debt lookup and investment grouping remain inline compatibility boundaries.
- Prepared `index.modular-budget-phase1b.html` with four bounded delegations.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Budget regression test file was expanded for duplicate-prevention and purpose filtering, but Node test execution and browser/runtime parity are not recorded as executed.

## Current state
Budget owns pure keys/month matching/progress classification and resolved Transfer-backed actual calculations. Source creation/mutation and UI remain inline.

## NEXT STEP
### Budget — Phase 1C: planning-source normalization
1. Inspect `ensurePlanningBudgetSources()`, `ensureAssetIncomeSource()` and related source-key helpers.
2. Extract pure source identity/name/color/seed-decision helpers only; keep category/subcategory array mutation inline.
3. Preserve user-edited monthly Budget values: source synchronization must never overwrite an existing user amount.
4. Preserve auto-import semantics for Savings goals, Loans, eligible Investments and Asset Income.
5. Keep persistence/UI/localization inline.
6. Add focused regression tests and static syntax validation.

## Future order
Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
