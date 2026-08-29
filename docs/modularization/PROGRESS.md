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
- Savings Phase 1 COMPLETE through 1E.

### Savings Phase 1 closure
- 1A module `ca69457a11561da57710f78fefa7b02dad713a83`; tests `045a049e509541264dea00da3e8a81ff24c5691b`.
- 1B module `eb687fed9ee664f4862c531d0c2f3dc96682c7f9`; tests `1004e7cb5390865151c8b09cab67046d751f0e7b`.
- 1C module `ee35ee12af291d01a9f297246e297c2f7db60969`; tests `417fb2eb5e50f354c85e941f7bf746acda82679a`.
- 1D module `ed8b13c12524b79eca43912db9e9078998bb2ab6`; tests `341f6ee6fec6acdd31f9e687bbe758531926214f`.
- 1E closure marker `277a74ed57f10c7b623793e49f6235aafa71b8a8`.

### Savings — Phase 1E closure audit
- Prepared `index.modular-savings-phase1e.html` preserves Phase 1D behavior; closure adds no speculative monolith mutation.
- Confirmed Savings contribution/progress calls are delegated to `MongoSavings`; automatic contribution is restricted to savings-purpose transfers plus actual credited savings-interest income.
- Confirmed account transfer infrastructure retains source/destination semantics through the transaction/core boundaries; savings-purpose transfers are not reclassified as ordinary expenses.
- Confirmed goal progress is a planning/progress calculation and is not used to manufacture account balance. Savings account balance continues through account/ledger balance logic.
- Opening balance remains goal initial `saved` only when a new linked goal is created from the savings account; transfer contributions are separately accumulated, avoiding conversion of opening balance into a transfer.
- Confirmed actual savings interest construction is `type:'income'` with `incomePurpose:'savings_interest'` and one selected receiving account; destination selection is compound/maturity=self, payout=configured/default, none=no destination.
- Budget savings subcategory/source mutation remains inline for the Budget phase.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node savings regression suite and browser/runtime parity are not recorded as executed.

## Current state
Savings Phase 1 is closed. Pure goal/progress math, savings account interest/linkage metadata, actual-interest transaction construction, and create/link goal normalization are modularized. Mutation/persistence/Budget integration remain compatibility boundaries.

## NEXT STEP
### Assets — Phase 1A: pure asset/investment calculation foundation
1. Inspect exact asset/investment aggregation, value, income/yield and same-name purchase logic in the latest prepared HTML.
2. Extract only pure calculations/normalization to `src/features/assets/assets.js`.
3. Preserve the distinction between asset purchase/account movement, asset income and ordinary expense/income.
4. Preserve same-name investment aggregation behavior exactly.
5. Keep transaction mutation, loan-funded asset linkage, Budget integration, persistence and UI inline initially.
6. Add focused Assets regression tests and run static syntax validation.

## Future order
Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
