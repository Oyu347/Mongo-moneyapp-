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

### Assets — Phase 1C: linked update + loan-funded asset normalization
Module extraction commit `f9d4d1bb4533833ebd7ab09015cd48a35f238070`; exact-parity correction `0c5e836e90304d51f5dc0dedc4bdd8c445ffbe48`.
Tests initial `4772340bd920886db22147a448f97693debbcdab`; parity-aligned `a314920f062c3e75a3daf5db562dd3dc47cec572`.

- Added pure `updateAutoInvestment()` and `makeLoanFundedAsset()` helpers.
- `makeLoanFundedAsset()` preserves `linkedDebtId`, `loanFunded:true`, value as both invested/current, type/date/color and income-producing metadata.
- Prepared `index.modular-assets-phase1c.html` delegates the direct loan-funded asset object construction only. Debt creation, loan funding mode, expense alternative, mutation, persistence and UI remain inline.
- Existing auto-linked investment update path was audited carefully. Its legacy order assigns the new invested amount before testing whether current equals invested. The pure helper was corrected to reproduce that effective behavior exactly.
- The existing linked-update caller remains inline in the prepared HTML for this phase rather than replacing a timing-sensitive mutation without runtime parity testing. The helper is regression-covered for a later safe caller migration.
- No loan principal/interest or account funding semantics changed.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node Assets regression suite and browser/runtime parity are not recorded as executed.

## Current state
Assets owns pure identity/grouping/performance, investment construction, transfer-purchase construction, auto-investment construction, exact linked-update normalization, and loan-funded asset construction. Financial mutations remain compatibility callers.

## NEXT STEP
### Assets — Phase 1D: asset income/yield normalization
1. Inspect exact asset-income save/edit paths and yield Budget source linkage.
2. Extract pure asset-income transaction construction/normalization only.
3. Preserve `incomePurpose`, source asset/group identity, receiving account and Income Plan inclusion metadata exactly.
4. Keep Budget source/category mutation, transaction insertion/edit/delete, persistence and UI inline.
5. Add focused regression tests and static syntax validation.

## Future order
Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
