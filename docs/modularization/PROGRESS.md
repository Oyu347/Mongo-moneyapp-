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
Module `b57ab57d250d99894d2e6079e87efce07dc456e6`; tests `d50df6233d1e2563a6ab18e976f9cc679f94dec2`. Metadata normalization/bootstrap and regression harness added.

### Accounts — Phase 1C
Module `78481fd0ec24a4150fe68e62fb27ce39f539c793`; tests `6b7468ff637835c3200ace09907d8b9ea912c26b`. Opening-balance preview and safe deactivation boundaries extracted without deleting history.

### Accounts — Phase 1D: creation/edit metadata construction
Module commit: `165d0f02802736f903b932b83c027d35641ee0a9`
Test update commit: `af4627fafed3c291343886f7ddf90d7cb7e74eb1`

- Added `cleanName()` and `cleanDate()` metadata helpers.
- Added `makeAccount(input,id,fallbackDate)` to construct the persisted account metadata shape without DOM, persistence or ledger mutation.
- `makeAccount()` preserves legacy `bank` → `checking`, non-negative opening balance, active state, start date and savings metadata.
- Savings construction preserves compound/maturity self-destination semantics and payout destination semantics.
- Added `editMetadata(account,patch)` for name/type/startDate and savings metadata edits while preserving account ID/opening balance/history.
- Regression harness now covers account creation normalization, required-name validation, savings self-interest destination and savings metadata edits.
- Prepared `index.modular-accounts-phase1d.html` from the exact Phase 1C prepared HTML.
- Migrated the base `addMoneyAccount()` account-object construction to `MongoAccounts.makeAccount()` and the base edit modal name/type assignment to `MongoAccounts.editMetadata()`.
- Later V43.58/V43.59 savings-specific wrappers remain inline for compatibility; they are not removed or rewritten in this phase.
- `saveData()`, DOM, rendering, goal creation, Firebase/cloud and ledger/history remain outside Accounts.
- Static syntax validation of prepared Phase 1D HTML: 44 non-empty inline JavaScript blocks, 0 syntax errors.

Execution note: static syntax validation was executed locally. GitHub Node regression suites and browser/runtime parity are not recorded as executed yet.

## Current state
Accounts owns pure account identity/type/bootstrap/read helpers, opening-balance calculation, safe deactivation metadata, and base account create/edit metadata construction. Compatibility UI and later savings-account enhancement wrappers remain inline.

## NEXT STEP
### Accounts — Phase 1E: account option/selection helpers + phase closure review
1. Extract pure active-account option/filter selection data helpers used by transaction/loan/asset selectors without moving DOM rendering.
2. Verify account creation/edit/deactivation callers consistently preserve IDs, opening balances, active state and historical ledger references.
3. Add regression cases for active/inactive selection and excluded source/destination account behavior.
4. Review whether remaining account-owned pure logic is safe to extract; leave savings-interest/goal business logic for Savings rather than overloading Accounts.
5. If Accounts boundary is clean, mark Accounts Phase 1 complete and move next to Transactions Phase 1A.
6. Keep Firebase/cloud untouched and do not modify `main`.

## Future order
Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At the end of every modularization session update this document with changes, commits, tests, unresolved risks and exact next step.
