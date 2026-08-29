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

### Accounts — Phase 1: COMPLETE

Phase commits:
- 1A foundation: `67dfae3e3621189b0288ceb0b9f3118da551f0fd`
- 1B metadata: `b57ab57d250d99894d2e6079e87efce07dc456e6`
- 1C safe mutation boundaries: `78481fd0ec24a4150fe68e62fb27ce39f539c793`
- 1D creation/edit construction: `165d0f02802736f903b932b83c027d35641ee0a9`
- 1E selection helpers: `f1732051b19a36913d054506f20dfde06f2b9372`
- Latest Accounts tests: `5dda927d4bce419b2fc3424c046946b10d492129`

Accounts Phase 1 now owns pure compatibility logic for:
- legacy `bank` → `checking` normalization and active/spendable/savings classification,
- account metadata/bootstrap and `legacy_main`,
- default account assignment for legacy transactions,
- account lookup and active-account filtering/selection,
- source/destination exclusion and distinct transfer destination selection,
- account creation/edit metadata construction,
- opening-balance totals and edit preview,
- ledger-derived account totals and zero-balance deactivation eligibility,
- transfer-only account history rows,
- safe metadata deactivation without deleting historical transactions/transfers/ledger entries.

Prepared HTML progression delegates the safe pure callers while preserving compatibility UI, confirmation, rendering and persistence boundaries. Phase 1E delegates active selector lists, account option exclusion and distinct destination selection to `MongoAccounts` without moving DOM rendering.

Savings-interest and goal-specific business behavior remains outside Accounts intentionally and should be handled in the Savings phase. Transfer financial semantics remain owned by Core/Transactions rather than Accounts. Firebase/cloud remains untouched.

Static syntax validation of prepared `index.modular-accounts-phase1e.html`: 44 non-empty inline JavaScript blocks, 0 syntax errors.

Execution note: static syntax validation was executed locally. GitHub Node regression suites and browser/runtime parity are not recorded as executed yet; do not treat static syntax success as runtime proof.

## Current state
Storage Phase 1, Core Phase 1 and Accounts Phase 1 modular foundations are complete on `development-modular`. The exact prepared full HTML remains local because the monolithic file is too large to safely replace through the GitHub contents connector.

## NEXT STEP
### Transactions — Phase 1A: identify boundaries and create compatibility module

Target: `src/features/transactions/transactions.js`

1. Inspect exact latest prepared full HTML for ordinary income/expense transaction creation/edit/delete, transfer form routing, account selection, category/subcategory assignment, date/amount normalization and transaction list/search/filter helpers.
2. Keep ledger construction in `MongoLedgerCore`; Transactions should prepare/validate transaction-facing data, not duplicate ledger semantics.
3. Keep account metadata/selection ownership in `MongoAccounts`; reuse it rather than duplicating account filters.
4. Preserve transfer invariants: Bank ↔ Cash/internal account transfers must not become income/expense and must not change total money solely because of the transfer.
5. Preserve loan-payment exclusion from ordinary expense rows and leave loan-specific principal/interest business logic for Loans.
6. Start with pure compatibility helpers and a focused regression harness before migrating risky transaction mutations.
7. Keep DOM, `saveData()`, Firebase/cloud and `main` untouched.

## Future order
Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At the end of every modularization session update this document with changes, commits, tests, unresolved risks and exact next step.
