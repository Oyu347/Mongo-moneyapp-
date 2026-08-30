# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE.

### Budget — Phase 1A: pure key and progress foundation
Module: `fbe83463ee53f97fbed1e39eb44dc50b51da5558`
Tests: `d3def27de72eeead47627d98fa7423af7a9af8c4`

- Added `src/features/budget/budget.js` with pure category/subcategory key construction and year-month key construction.
- Added legacy-compatible pure Budget lookup helper: year+month key wins; legacy per-category month object is used only for the current Budget year.
- Added pure month matching and amount summation helpers.
- Added pure actual helpers for goal savings (Savings Transfer + credited savings interest), investment/asset Transfers and loan payment totals.
- Added pure plan-vs-actual progress/health classification preserving existing thresholds: expense >100% bad, expense >=80% warn, income <80% warn.
- Prepared `index.modular-budget-phase1a.html`: module loaded after Assets; `bKeyFor`, `bSubKey`, Budget year-month key helpers and Budget progress health classification delegate to `MongoBudget`.
- Existing `gSpent()` compatibility patch remains inline for now because it resolves category/source identities and uses Loans/Savings/Assets state.
- Auto-import source creation/mutation, Budget writes, persistence, UI and localization remain inline.
- Asset Income Plan remains optional and separate from actual asset income.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Budget Node regression test file was committed but is not recorded as executed. Browser/runtime parity is not recorded as executed.

## Current state
Budget Phase 1A establishes the pure key/month/progress boundary without changing Budget source mutation or financial classifications.

## NEXT STEP
### Budget — Phase 1B: Transfer-backed actual progress
1. Delegate bounded goal savings, loan payment and investment/asset Transfer actual calculations from the active `gSpent()` compatibility layer to `MongoBudget`.
2. Preserve category/source identity resolution inline; only pass resolved IDs/keys/payments into pure helpers.
3. Confirm savings actual = savings Transfers + credited savings interest, not ordinary Expense duplication.
4. Confirm loan Budget actual = total cash payment while principal/interest accounting remains unchanged elsewhere.
5. Confirm investment actual accepts `investment` and `asset` purpose only for eligible investment source identities.
6. Add focused regression cases and static syntax validation.

## Future order
Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
