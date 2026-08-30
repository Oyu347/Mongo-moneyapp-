# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE.

### Assets — Phase 1A
Module `2a0037d0aa63c3c611937c3025b109588f0377cd`; tests `32ea67da08836eb7e3800986e66143230d5fb8d4`.

### Assets — Phase 1B: asset/investment object normalization
Module: `34b6a68b4709145d3ac7d7b5e9fae6d147ac9b10`
Tests: `f8c82495afaa453d37ebd22f102f25f92d915fa0`

- Added pure `makeInvestment()`, `makeGroupPurchase()` and `makeAutoInvestment()` object builders.
- Manual investment add now delegates object construction while preserving name/type/invested/current/date/color/income-producing fields and the existing rule that blank current value falls back to invested value.
- New asset purchase from the Transfer flow delegates construction with `assetPurchase:true`; purchase into an existing Type+Name group delegates through `makeGroupPurchase()` and preserves group color and income-producing status.
- New investment auto-created from an investment expense transaction delegates construction through `makeAutoInvestment()` and preserves `sourceTxnId`, type, amount/date and `autoAdded:true`. Existing linked investment update behavior remains inline.
- Loan-funded asset creation remains inline for a later bounded Assets phase so debt linkage behavior is not mixed into this extraction.
- Account transfer insertion, balance checks, transaction mutation, Budget mutation, persistence and UI remain inline.
- Asset acquisition is still distinct from ordinary income; no financial classification was changed in this phase.
- Prepared `index.modular-assets-phase1b.html` with four bounded caller delegations.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node Assets regression suite and browser/runtime parity are not recorded as executed.

## Current state
Assets owns pure identity/grouping/performance plus object construction for manual investments, transfer-purchased assets and newly auto-linked investment transactions. Financial mutation remains in compatibility callers.

## NEXT STEP
### Assets — Phase 1C: linked asset update + loan-funded asset normalization
1. Inspect exact existing auto-linked investment update path and direct loan-funded asset creation path.
2. Extract pure update/normalization helpers while preserving `sourceTxnId`, `linkedDebtId`, `loanFunded`, `assetPurchase` and income-producing fields.
3. Do not change loan principal/interest or funding-account semantics.
4. Keep mutation, deletion, account balance, Budget integration, persistence and UI inline.
5. Add focused regression tests and static syntax validation.

## Future order
Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
