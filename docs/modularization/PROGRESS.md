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
### Savings — Phase 1C
Module `ee35ee12af291d01a9f297246e297c2f7db60969`; tests `417fb2eb5e50f354c85e941f7bf746acda82679a`.

### Savings — Phase 1D: create-and-link goal normalization + migration audit
Module: `ed8b13c12524b79eca43912db9e9078998bb2ab6`
Tests: `341f6ee6fec6acdd31f9e687bbe758531926214f`

- Added pure `makeLinkedGoal()` supporting three exact linkage outcomes: existing selected goal, no goal, or create a new goal.
- New-goal validation preserves positive target requirement; goal name comes from the account name, opening balance becomes initial saved amount, explicit deadline falls back to maturity date, and history starts empty.
- Prepared `index.modular-savings-phase1d.html` delegates V43.59 goal object/linkage normalization to `MongoSavings.makeLinkedGoal()` while keeping `goals.push`, Budget savings subcategory creation, account mutation, persistence and UI inline.
- Legacy linkage compatibility remains `linkedGoalId` first with `goalId` fallback through `MongoSavings.linkedGoalId()`.
- Savings contribution audit preserved the invariant: automatic goal contributions come from `purpose:'savings'` transfers plus actual credited savings-interest income; ordinary expense transactions are not converted into savings contributions.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node savings regression suite and browser/runtime parity are not recorded as executed.

## Current state
Savings owns pure goal/progress math, account interest/linkage metadata, actual-interest transaction construction, and create/link goal normalization. Mutation/persistence/Budget category creation remain compatibility boundaries.

## NEXT STEP
### Savings — Phase 1E: closure audit
1. Audit Savings transfer contribution, goal progress, savings account balance and interest paths against ledger invariants.
2. Confirm savings transfer decreases source/increases destination without changing income/expense totals.
3. Confirm goal progress does not inflate account balances and opening balance is not double-counted through transfers.
4. Confirm actual interest is income exactly once and credited to the selected destination semantics.
5. Leave Budget auto-category/subcategory mutation for Budget phase.
6. If no low-risk pure Savings boundary remains, mark Savings Phase 1 COMPLETE and move to Assets Phase 1A.
7. Re-run static syntax validation; runtime tests only if actually executed.

## Future order
Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
