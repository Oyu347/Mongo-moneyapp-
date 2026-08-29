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

### Transactions — Phase 1B
Module `2f15dc6eff62c133703cba80f39ae5faf9f45a5f`; tests `1c5433330aa2b4e1c7cae48d07228c7bd41a0209`.

### Transactions — Phase 1C
Module `dfcf541f16a43c1c8d8d43c0c5785af21b6818e1`; tests `a92e024440ca015b6c49e61c250cd9cddaf86e92`.
Added immutable ordinary removal helpers and explicit internal-transfer constructor.

### Transactions — Phase 1D: exact transfer caller + delete boundary
Regression update: `87498e78579f02f6c23e02395a2fbcef9d4aec2f`

- Inspected the exact current `addTransaction()` transfer handler in the prepared Phase 1C HTML.
- The ordinary non-asset transfer path validates amount/source/destination/same-account and insufficient source balance before mutation.
- Prepared `index.modular-transactions-phase1d.html` delegates that exact ordinary account-to-account transfer object construction to `MongoTransactions.makeInternalTransfer()` and then unshifts the validated result.
- Asset purchase path remains inline and untouched, including asset registration/expense choice and asset-linked transfer metadata.
- `delTxn()` keeps confirmation, linked investment cleanup and Pay Yourself First cleanup before replacing the transaction array via `MongoTransactions.removeById()`.
- Loan-payment deletion remains specialized and inline; it is not treated as ordinary transaction deletion.
- Regression coverage now mirrors caller-supplied transfer ID/from/to/amount/date/target metadata.
- Static syntax validation executed on prepared Phase 1D HTML: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node regression suites and browser/runtime parity are not recorded as executed.

## Current state
Transactions now owns ordinary income/expense construction/edit, read/filter/summary, immutable ordinary deletion calculation, and exact ordinary internal account-to-account transfer construction. Cross-feature side effects, persistence/UI, asset purchase, savings/loan/investment special flows remain compatibility boundaries.

## NEXT STEP
### Transactions — Phase 1E: transaction boundary audit and Phase 1 closure
1. Audit remaining ordinary transaction/transfer constructors and delete/edit callers for duplicated low-risk logic.
2. Do not absorb loan, savings, investment, asset purchase or Pay Yourself First business rules into Transactions.
3. Confirm module load order and caller dependencies in the prepared HTML.
4. Add only necessary parity tests for remaining ordinary boundaries.
5. Re-run static syntax checks and, if practical, execute the Node Transactions regression suite locally.
6. If clean, close Transactions Phase 1 and move to Loans Phase 1A.

## Future order
Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
