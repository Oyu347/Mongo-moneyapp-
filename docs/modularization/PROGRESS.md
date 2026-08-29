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

### Savings — Phase 1A: pure goal calculation foundation
Module: `ca69457a11561da57710f78fefa7b02dad713a83`
Tests: `045a049e509541264dea00da3e8a81ff24c5691b`

- Created `src/features/savings/savings.js` with pure goal contribution/progress and calendar helpers.
- Goal auto-saved value counts only `purpose:'savings'` transfers linked by targetId plus actual savings-interest income linked by goalId.
- Ordinary/internal transfers, unrelated income and expense transactions do not contribute to goal savings.
- Effective saved preserves existing manual `goal.saved` plus automatic contributions; progress remains rounded and capped at 100%.
- Extracted safe month arithmetic, ceiling month count and calendar month/day difference with the same noon-local date behavior.
- Prepared `index.modular-savings-phase1a.html` loads Savings after Loans and delegates `getGoalAutoSaved`, `getGoalEffectiveSaved`, `goalProgressPct`, `addMonthsSafe`, `monthsBetweenCeil` and `calendarMonthsDaysBetween` through `MongoSavings`.
- Savings transfer mutation/migration, savings account creation/linking, interest recording, Budget integration, persistence and UI remain inline.
- No savings contribution is reclassified as an expense.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node savings regression suite and browser/runtime parity are not recorded as executed.

## Current state
Savings Phase 1 has a pure goal/progress calculation foundation. Actual account balances remain the source for Savings total/chart; goals remain planning/progress objects and do not inflate real savings.

## NEXT STEP
### Savings — Phase 1B: goal/account linkage + interest metadata boundary
1. Inspect savings account `goalId/linkedGoalId`, interest mode/rate/frequency/destination and maturity metadata normalization.
2. Extract pure linkage/metadata normalization only; do not move account creation or persistence yet.
3. Preserve compound vs payout vs maturity/none semantics exactly.
4. Preserve actual credited interest recording rather than forecasting it as received cash.
5. Add regression tests and delegate only exact low-risk callers.
6. Re-run static syntax validation; runtime tests only if actually executed.

## Future order
Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
