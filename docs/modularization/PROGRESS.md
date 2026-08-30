# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE.

### Assets — Phase 1A: pure aggregation foundation
Module: `2a0037d0aa63c3c611937c3025b109588f0377cd`
Tests: `32ea67da08836eb7e3800986e66143230d5fb8d4`

- Created `src/features/assets/assets.js` with pure investment name normalization, Type+Name identity, grouping, income-producing detection, group performance and portfolio totals.
- Same normalized name aggregates only inside the same investment type. Example: Stock `Apple` purchases combine, while Bond `Apple` remains a separate group.
- Aggregation preserves invested/current totals across purchase items; P/L and percent remain derived from grouped totals.
- Prepared `index.modular-assets-phase1a.html` loads Assets after Savings and delegates `normInvestName`, `investGroupKey`, `getInvestGroups`, `assetGroupIncomeProducing`, portfolio totals and per-group performance to `MongoAssets`.
- Existing color selection remains supplied by the UI compatibility caller, preserving current palette behavior without putting UI/color policy into the pure module.
- Asset purchase transaction mutation, loan-funded asset linkage, asset-income transaction creation, Budget yield-source integration, persistence and UI remain inline.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node Assets regression suite and browser/runtime parity are not recorded as executed.

## Current state
Assets Phase 1 now has a pure identity/aggregation/performance foundation. The financial distinction between asset value, asset purchase movement and asset income has not been changed.

## NEXT STEP
### Assets — Phase 1B: asset purchase normalization boundary
1. Inspect exact manual asset add and transaction-driven asset purchase creation/update paths.
2. Extract pure asset purchase object normalization only where both paths can preserve exact Type+Name identity.
3. Preserve account movement/transfer semantics: acquiring an asset must not become ordinary income; do not invent expense behavior.
4. Preserve source transaction linkage and loan-funded asset linkage fields exactly.
5. Keep transaction insertion/removal, account balance checks, Budget mutation, persistence and UI inline.
6. Add focused regression tests and static syntax validation.

## Future order
Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
