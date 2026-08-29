# Möngö Modularization Progress

This file is the handoff/checkpoint for future modularization sessions. Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Baseline
Use the exact latest working/prepared V44 full HTML. Never reconstruct the monolith from truncated GitHub contents.

## Completed

### Storage — Phase 1
`src/services/storage/storage.js` compatibility foundation exists. Firebase/cloud remains for later.

### Core — Phase 1: COMPLETE
`src/core/ledger.js` owns pure ledger construction, balances, validation and rebuild detection. Regression/parity harnesses exist under `tests/core/`. UI/persistence/Firebase remain outside Core.

### Accounts — Phase 1A
Commit `67dfae3e3621189b0288ceb0b9f3118da551f0fd`: created `src/features/accounts/accounts.js` and delegated smallest pure account read helpers.

### Accounts — Phase 1B
Module `b57ab57d250d99894d2e6079e87efce07dc456e6`; tests `d50df6233d1e2563a6ab18e976f9cc679f94dec2`.
Accounts owns pure metadata normalization/bootstrap, legacy `legacy_main`, default assignment, account totals/history helpers. `ensureMoneyAccounts()` delegates the safe metadata/bootstrap pieces.

### Accounts — Phase 1C: opening balance + deactivation boundaries
Module commit: `78481fd0ec24a4150fe68e62fb27ce39f539c793`
Test update commit: `6b7468ff637835c3200ace09907d8b9ea912c26b`

- Added `openingBalanceChange()` as a pure preview/calculation helper. It returns before/after/delta/current/result/changed and does not mutate the account or historical movements.
- Added `deactivateMetadata()` which only marks account metadata inactive after `canDeactivate()` confirms ledger-derived balance is zero within tolerance.
- Prepared `index.modular-accounts-phase1c.html` from exact Phase 1B prepared HTML.
- Opening-balance edit UI now delegates its balance/delta/result calculation to `MongoAccounts.openingBalanceChange()`; confirmation, actual metadata assignment, rendering and `saveData()` remain inline.
- `archiveMoneyAccount()` delegates zero-balance eligibility and final metadata deactivation to `MongoAccounts`; confirmation/render/save remain inline.
- No transactions, transfers or ledger history are deleted during deactivation.
- Updated Accounts regression test with opening-balance preview non-mutation, history preservation, non-zero deactivation rejection and zero-balance deactivation success.
- Static syntax validation of prepared Phase 1C HTML: 44 non-empty inline JavaScript blocks, 0 syntax errors.

Execution note: static syntax validation was executed locally. GitHub Node regression suites/browser runtime parity are not yet recorded as executed in an executable checkout.

## Current state
Accounts owns safe pure metadata/bootstrap/read logic plus opening-balance calculation and deactivation eligibility/metadata mutation. UI confirmation/rendering/persistence remain compatibility boundaries. Historical ledger/transfer data stays untouched.

## NEXT STEP
### Accounts — Phase 1D: account creation/edit metadata construction
1. Extract pure `makeAccount()` and `applyAccountMetadataEdit()` helpers for name/type/startDate/openingBalance/active shape.
2. Preserve IDs and existing start-date/opening-balance semantics; do not modify ledger/history.
3. Delegate construction/calculation portions of `addMoneyAccount()` and account edit while leaving DOM, confirmation, save/render inline.
4. Add regression cases for later-created account: opening balance counted once, earlier transaction/transfer history unchanged.
5. Keep Firebase/cloud untouched.
6. Re-run static syntax checks; execute Node/browser suites only when an executable environment is actually used.

## Future order
Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At the end of every modularization session update this document with changes, commits, tests, unresolved risks and exact next step.
