# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE.

### Assets Phase 1 closure
- 1A module `2a0037d0aa63c3c611937c3025b109588f0377cd`; tests `32ea67da08836eb7e3800986e66143230d5fb8d4`.
- 1B module `34b6a68b4709145d3ac7d7b5e9fae6d147ac9b10`; tests `f8c82495afaa453d37ebd22f102f25f92d915fa0`.
- 1C parity-aligned module `0c5e836e90304d51f5dc0dedc4bdd8c445ffbe48`; tests `a314920f062c3e75a3daf5db562dd3dc47cec572`.
- 1D module `b5c11e94e454069f352967907ce2e0aa7d4fcc28`; tests `b840aded0a091a06aec59588d6b439779187d020`.
- 1E closure marker `d22865aa12b6aa34802d5bd2305afaece65e2edf`.

### Assets — Phase 1E closure audit
- Prepared `index.modular-assets-phase1e.html` is audit-only and preserves Phase 1D behavior.
- Type + normalized-name grouping remains the identity rule for same-name investment aggregation; a same name under a different type remains separate.
- Manual investments, transfer-purchased assets, new auto-linked investments and loan-funded assets use pure object builders; application-state mutation remains inline.
- Asset purchase remains acquisition/account movement metadata (`assetPurchase`) rather than ordinary income; no new income transaction is manufactured by asset construction.
- Actual asset income is a distinct `type:'income'` transaction with one selected receiving `accountId`, `assetIncome:true`, group identity and income kind. The active V43.73 path inserts that transaction once.
- Income Plan remains explicit optional planning state (`incomePlanIncluded`) and its Budget write occurs only after the actual income transaction has been constructed/inserted.
- Loan-funded asset construction preserves asset value separately from the linked debt (`linkedDebtId`, `loanFunded:true`); debt principal/interest semantics were not changed.
- Budget source/category/subcategory mutation remains inline and is deferred to Budget Phase 1.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node Assets regression suite and browser/runtime parity are not recorded as executed.

## Current state
Assets Phase 1 is closed. Pure identity/grouping/performance, investment/asset construction, linked-update normalization, loan-funded asset construction and actual asset-income transaction construction are modularized. State mutation, persistence, Budget integration and UI remain compatibility boundaries.

## NEXT STEP
### Budget — Phase 1A: pure budget key/range/progress foundation
1. Inspect exact monthly/yearly Budget key construction and income/expense plan lookup in the latest prepared HTML.
2. Inspect actual-vs-plan progress calculation, including savings/loan/investment Transfer-backed progress and asset-income plan behavior.
3. Extract only pure key/range/progress calculations to `src/features/budget/budget.js`.
4. Preserve auto-import source semantics from Loans, Savings goals, Investments and Asset Income exactly.
5. Keep category mutation, plan writes, persistence, UI and localization inline initially.
6. Add focused Budget regression tests and run static syntax validation.

## Future order
Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
