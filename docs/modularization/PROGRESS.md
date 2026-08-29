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

### Transactions Phase 1 closure
- 1A module `4b830c4823857b784fe0ddc05192df6be238d18d`, tests `82a6fed6ff5d8400f59982091050356cf253c084`.
- 1B module `2f15dc6eff62c133703cba80f39ae5faf9f45a5f`, tests `1c5433330aa2b4e1c7cae48d07228c7bd41a0209`.
- 1C module `dfcf541f16a43c1c8d8d43c0c5785af21b6818e1`, tests `a92e024440ca015b6c49e61c250cd9cddaf86e92`.
- 1D regression `87498e78579f02f6c23e02395a2fbcef9d4aec2f`; exact ordinary internal-transfer caller migrated in prepared HTML.
- 1E closure module marker `7116a3617f463d1a3397fdec8046084f97d98468`.

### Transactions Phase 1E audit
- Prepared `index.modular-transactions-phase1e.html` preserves the exact Phase 1D behavior; Phase 1E is an audit/closure checkpoint, not a speculative behavior change.
- Confirmed module load order in prepared HTML: Core → Accounts → Transactions.
- Confirmed ordinary transaction construction, edit, delete-array calculation and ordinary internal-transfer construction delegate to `MongoTransactions`.
- Confirmed asset-purchase and loan-special logic remain outside Transactions as intended; savings/investment/PYF linked side effects remain compatibility boundaries.
- No additional ordinary constructor was migrated because no further low-risk duplicate boundary justified a change.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node Transactions regression suite and browser/runtime parity are not recorded as executed.

## Current state
Transactions Phase 1 is closed. `MongoTransactions` owns ordinary transaction shape/edit/read/filter/summary, immutable ordinary deletion calculation, and ordinary internal account-to-account transfer construction. Cross-feature business rules and persistence/UI remain outside.

## NEXT STEP
### Loans — Phase 1A: pure loan calculation/metadata boundary
1. Inspect exact loan creation, repayment schedule, equal-principal/equal-payment and remaining-balance logic in the latest prepared HTML.
2. Identify pure calculations that can move to `src/features/loans/loans.js` without UI/storage/Firebase dependencies.
3. Preserve principal-vs-interest semantics and extra-payment behavior exactly.
4. Do not reclassify loan repayment as ordinary expense; preserve account/transfer integration boundaries.
5. Add focused loan regression tests before caller migration.
6. Prepare the next full HTML from `index.modular-transactions-phase1e.html` and run static syntax validation.

## Future order
Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
