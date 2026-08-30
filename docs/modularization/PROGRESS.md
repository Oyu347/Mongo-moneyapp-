# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE.

### Assets — Phase 1A
Module `2a0037d0aa63c3c611937c3025b109588f0377cd`; tests `32ea67da08836eb7e3800986e66143230d5fb8d4`.
### Assets — Phase 1B
Module `34b6a68b4709145d3ac7d7b5e9fae6d147ac9b10`; tests `f8c82495afaa453d37ebd22f102f25f92d915fa0`.
### Assets — Phase 1C
Module parity-aligned `0c5e836e90304d51f5dc0dedc4bdd8c445ffbe48`; tests `a314920f062c3e75a3daf5db562dd3dc47cec572`.

### Assets — Phase 1D: actual asset income normalization
Module: `b5c11e94e454069f352967907ce2e0aa7d4fcc28`
Tests: `b840aded0a091a06aec59588d6b439779187d020`

- Added pure `makeAssetIncomeTransaction()` for actual received asset income.
- Preserves `type:'income'`, receiving `accountId`, `assetIncome:true`, `assetGroupKey`, income kind (`rent/dividend/interest/other`) and explicit `incomePlanIncluded` state.
- Active V43.73 `mongoCommitAssetIncomeV4373()` now delegates only transaction object construction to `MongoAssets`.
- Yield/Income Budget category and subcategory preparation remains inline through `ensureAssetIncomeSource()` / `ensureYieldBudgetSource()`.
- Optional Income Plan write remains a follow-up after the actual income transaction and cannot define or manufacture the received income itself.
- Transaction insertion, persistence, modal lifecycle and rendering remain inline.
- Older legacy asset-income save wrappers remain untouched; only the active V43.73 commit path was migrated.
- Prepared `index.modular-assets-phase1d.html` with one bounded active-caller delegation.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node Assets regression suite and browser/runtime parity are not recorded as executed.

## Current state
Assets owns pure identity/grouping/performance, asset/investment object normalization, loan-funded construction and actual asset-income transaction construction. Budget mutation and application state mutation remain compatibility boundaries.

## NEXT STEP
### Assets — Phase 1E: closure audit
1. Audit asset acquisition, asset income, loan-funded asset and same-name aggregation invariants.
2. Confirm asset purchase/account movement does not become ordinary income and does not double-count value.
3. Confirm asset income credits the selected account exactly once and Income Plan remains optional metadata/planning.
4. Confirm loan-funded asset value and loan liability remain separate sides of net-worth logic.
5. Leave Budget source/category mutation for Budget Phase 1.
6. If no low-risk pure Assets boundary remains, mark Assets Phase 1 COMPLETE and move to Budget Phase 1A.
7. Re-run static syntax validation; runtime tests only if actually executed.

## Future order
Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
