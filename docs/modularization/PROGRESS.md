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

### Transactions — Phase 1B: ordinary add/edit boundary
Module update: `2f15dc6eff62c133703cba80f39ae5faf9f45a5f`
Regression update: `1c5433330aa2b4e1c7cae48d07228c7bd41a0209`

- `makeTransaction()` now preserves explicit category/subcategory keys and optional `createdAt` metadata.
- `applyEdit()` preserves stable transaction ID and original `createdAt`, and validates the replacement shape before mutating the existing object.
- Prepared `index.modular-transactions-phase1b.html` delegates ordinary income/expense new-object construction and edit field application to `MongoTransactions`.
- Existing insufficient-balance checks remain inline before construction/edit.
- Pay Yourself First sync/removal, investment sync/removal, loan-specific compatibility behavior, UI reset, save/render and cloud journal wrappers remain inline.
- Transfer/asset-purchase mutation paths remain inline for a later bounded phase.
- Regression harness extended for account/category/subcategory/date/type preservation, stable ID/createdAt and invalid-edit non-mutation.
- Static syntax validation executed on prepared Phase 1B HTML: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node regression suites and browser/runtime parity are not recorded as executed.

## Current state
Transactions owns ordinary transaction construction/edit shape plus read/filter/summary helpers. Special cross-feature side effects and persistence remain compatibility boundaries.

## NEXT STEP
### Transactions — Phase 1C: ordinary delete + internal transfer construction boundary
1. Delegate ordinary transaction delete-array calculation to `MongoTransactions.removeById()` while keeping confirmation and linked feature cleanup inline.
2. Delegate internal account-to-account transfer object construction to `makeTransfer()` after existing balance validation.
3. Preserve transfer invariants: source decreases, destination increases, total account money/income/expense unchanged solely due internal transfer.
4. Keep asset-purchase transfer branch inline; do not mix asset registration into ordinary transfer extraction.
5. Extend regression coverage for delete immutability and internal-transfer metadata.
6. Re-run static syntax checks; runtime tests only if actually executed.

## Future order
Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
