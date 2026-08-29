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

### Transactions — Phase 1A
Module `4b830c4823857b784fe0ddc05192df6be238d18d`; tests `82a6fed6ff5d8400f59982091050356cf253c084`.
Created pure transaction/transfer construction, filtering and summary foundation; prepared HTML delegated low-risk read helpers.

### Transactions — Phase 1B
Module `2f15dc6eff62c133703cba80f39ae5faf9f45a5f`; tests `1c5433330aa2b4e1c7cae48d07228c7bd41a0209`.
Ordinary income/expense construction and edit shape delegated while special linked side effects remain inline.

### Transactions — Phase 1C: ordinary removal + internal transfer boundary
Module update: `dfcf541f16a43c1c8d8d43c0c5785af21b6818e1`
Regression update: `a92e024440ca015b6c49e61c250cd9cddaf86e92`

- Added `makeInternalTransfer()` as an explicit internal account-to-account transfer constructor over `makeTransfer()`.
- Added `removalPreview()` plus existing immutable `removeById()` for ordinary transaction deletion calculation.
- Regression coverage verifies internal transfer purpose/source/destination/amount, rejects same/missing destination, and verifies deletion helpers do not mutate the source array.
- Prepared `index.modular-transactions-phase1c.html` from exact Phase 1B HTML.
- Ordinary exact `txns.filter(...id...)` deletion expressions found in the prepared monolith were delegated to `MongoTransactions.removeById()` where exact matches existed.
- The monolith's internal-transfer construction did not match the conservative exact object pattern used for automatic migration, so no risky guessed replacement was made in the prepared HTML. The module boundary and regression coverage are ready; exact caller migration remains for Phase 1D after inspecting the real transfer handler.
- Asset-purchase transfer branch remains inline and untouched.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node regression suites/browser runtime parity are not recorded as executed.

## Current state
Transactions owns ordinary construction/edit/read/filter/summary plus safe immutable deletion calculation and a validated internal-transfer constructor. Cross-feature cleanup, persistence, asset purchase and exact internal-transfer caller mutation remain compatibility boundaries.

## NEXT STEP
### Transactions — Phase 1D: exact transfer handler migration + delete boundary audit
1. Inspect the exact current transfer-submit handler in the prepared Phase 1C HTML rather than guessing its shape.
2. Delegate only the ordinary account-to-account transfer object construction to `makeInternalTransfer()` after existing balance validation.
3. Leave asset purchase, savings/loan/investment linked effects and persistence/UI inline.
4. Audit ordinary delete callers so linked cleanup happens before immutable array replacement and no special transaction is accidentally treated as ordinary.
5. Add/adjust regression cases only for behavior actually migrated.
6. Re-run static syntax checks; runtime tests only if actually executed.

## Future order
Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
