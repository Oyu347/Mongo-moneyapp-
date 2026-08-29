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

### Savings — Phase 1B
Module `eb687fed9ee664f4862c531d0c2f3dc96682c7f9`; tests `1004e7cb5390865151c8b09cab67046d751f0e7b`.

### Savings — Phase 1C: actual interest transaction normalization
Module: `ee35ee12af291d01a9f297246e297c2f7db60969`
Tests: `417fb2eb5e50f354c85e941f7bf746acda82679a`

- Added pure `makeInterestTransaction()` for user-confirmed, actually credited savings interest.
- Preserves `type:'income'`, `incomePurpose:'savings_interest'`, `savingsInterest:true`, savings account id, interest mode, goal link and receiving account.
- Validates positive rounded amount, date, receiving account and savings account id; it never forecasts or automatically creates interest.
- Prepared `index.modular-savings-phase1c.html` delegates only the transaction object construction in `saveSavingsInterest()` to `MongoSavings`.
- Budget yield category/source lookup remains inline before construction; insertion into `txns`, persistence, render and modal sequencing remain inline after construction.
- Compound/maturity/payout destination selection remains delegated through the Phase 1B `interestDestination()` boundary.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node savings regression suite and browser/runtime parity are not recorded as executed.

## Current state
Savings owns goal/progress math, account interest/linkage metadata, destination selection and pure construction of actual credited interest income. Mutation/persistence/Budget integration remain compatibility boundaries.

## NEXT STEP
### Savings — Phase 1D: create-and-link goal normalization + migration audit
1. Inspect V43.59 create-and-link savings goal flow and legacy goalId/linkedGoalId migration.
2. Extract only pure goal object/linkage normalization where behavior is exact.
3. Preserve existing target/deadline validation and account-name-derived goal naming.
4. Keep Budget auto-source/category creation, account mutation, persistence and UI inline.
5. Audit that savings transfers remain the only contribution movement and are never converted to expense.
6. Add focused regression tests and static syntax validation.

## Future order
Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
