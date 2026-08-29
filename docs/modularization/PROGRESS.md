# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Baseline
Use the exact latest prepared V44 full HTML; never reconstruct the monolith from truncated GitHub contents.

## Completed
- Storage Phase 1 compatibility foundation.
- Core Phase 1 COMPLETE: `src/core/ledger.js` owns pure ledger construction/balance/validation/rebuild logic.
- Accounts Phase 1 COMPLETE through 1E. Latest module commit `f1732051b19a36913d054506f20dfde06f2b9372`; latest Accounts tests `5dda927d4bce419b2fc3424c046946b10d492129`.

### Transactions — Phase 1A: compatibility foundation
Module commit: `4b830c4823857b784fe0ddc05192df6be238d18d`
Regression harness commit: `82a6fed6ff5d8400f59982091050356cf253c084`

Created `src/features/transactions/transactions.js` with pure helpers for:
- ordinary income/expense transaction construction and edit-shape application,
- internal/asset transfer construction and validation,
- immutable delete-by-id filtering,
- period range/in-period checks,
- account filtering,
- income/expense/transfer-in/transfer-out summaries.

Ownership boundaries:
- Ledger semantics remain in `MongoLedgerCore`.
- Account metadata/selection remains in `MongoAccounts`.
- Loan principal/interest, savings, investments/assets and Pay Yourself First side effects remain inline for their later feature phases.
- DOM, `saveData()`, Firebase/cloud and `main` remain untouched.

Prepared `index.modular-transactions-phase1a.html` from exact Accounts Phase 1E HTML. It loads Transactions after Accounts and delegates safe read-only period/filter/summary helpers. Risky add/edit/delete transaction mutations remain inline.

Static syntax validation of prepared HTML: 44 non-empty inline JavaScript blocks, 0 syntax errors. The first user-visible checker command used an incorrectly escaped extraction regex and undercounted 11 blocks; a corrected check immediately confirmed the authoritative count of 44/0. Node regression suites/browser runtime parity are not recorded as executed.

## Current state
Storage, Core and Accounts foundations are complete. Transactions Phase 1A foundation is created and only low-risk read helpers are delegated.

## NEXT STEP
### Transactions — Phase 1B: ordinary transaction construction/edit boundary
1. Delegate ordinary income/expense transaction object construction to `MongoTransactions.makeTransaction()` while preserving existing insufficient-balance checks and feature side effects.
2. Delegate edit field application to `MongoTransactions.applyEdit()` but keep Pay Yourself First, investment sync/removal, loan-specific behavior, UI reset, save/render inline.
3. Preserve stable transaction IDs on edit and account/category/subcategory/date fields exactly.
4. Add regression cases for edit ID stability and no mutation on invalid input.
5. Do not migrate transfer/asset purchase mutations yet unless isolated safely.
6. Re-run static syntax checks; do not claim runtime tests unless actually executed.

## Future order
Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
