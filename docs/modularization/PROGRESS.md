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

### Savings — Phase 1A
Module `ca69457a11561da57710f78fefa7b02dad713a83`; tests `045a049e509541264dea00da3e8a81ff24c5691b`.

### Savings — Phase 1B: goal/account linkage + interest metadata boundary
Module: `eb687fed9ee664f4862c531d0c2f3dc96682c7f9`
Tests: `1004e7cb5390865151c8b09cab67046d751f0e7b`

- Added pure savings-account interest metadata normalization for `compound`, `payout`, `maturity`, and `none` modes; rate, frequency, destination account, linked goal and maturity date are normalized without persistence/UI dependencies.
- Added `interestDestination()`: payout uses the configured receiving account (or current default account fallback); compound/maturity credit the savings account; none has no interest destination.
- Added `linkedGoalId()` with current `linkedGoalId` first and legacy `goalId` fallback.
- Prepared `index.modular-savings-phase1b.html` delegates new/edit savings account interest metadata, interest modal destination and recorded-interest goal linkage to `MongoSavings`.
- Actual interest remains recorded only when the user enters a bank-credited amount; the module does not forecast or auto-credit cash interest.
- Account creation/edit persistence, actual interest transaction creation, Budget yield source integration and UI remain inline.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node savings regression suite and browser/runtime parity are not recorded as executed.

## Current state
Savings owns pure goal/progress calculations plus savings interest/linkage metadata. Account balances remain the source of real savings value; transfer/interest mutation and persistence remain compatibility boundaries.

## NEXT STEP
### Savings — Phase 1C: actual interest transaction normalization
1. Extract pure construction/validation of a user-confirmed savings-interest transaction without auto-generating interest.
2. Preserve `type:'income'`, `incomePurpose:'savings_interest'`, savings account id, interest mode, goal link and receiving account semantics exactly.
3. Keep Budget category/source lookup, transaction insertion, persistence, cloud and UI outside the module.
4. Verify compound/maturity vs payout destination behavior remains exact.
5. Add focused regression tests and delegate only the safe construction boundary.
6. Re-run static syntax validation; runtime tests only if actually executed.

## Future order
Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
