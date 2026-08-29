# Möngö Modularization Progress

This file is the handoff/checkpoint for every future modularization session. Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing work.

## Branch

`development-modular`

`main` is not the modularization work branch.

## Baseline

Use the exact latest working/prepared V44 full HTML for caller migration. Do not reconstruct the monolithic file from truncated GitHub contents responses.

## Completed

### Storage — Phase 1

- `src/services/storage/storage.js` compatibility foundation created.
- Firebase/cloud remains separate for later `services/cloud` work.

### Core — Phase 1: COMPLETE

- `src/core/ledger.js` owns pure unified-ledger construction, balance, validation and rebuild logic.
- Regression/parity harnesses exist under `tests/core/`.
- Prepared HTML delegates selected compatibility wrappers to Core while UI, persistence and Firebase remain outside Core.

Key commits:
- Core foundation: `61164ec3277107b9ca6f71d098e680a31e963b73`
- Regression test: `a64d312ce0c9a9c17f396bd52f282c35862bc0b1`
- Parity harness: `b954b26929ae18ed6b651898a16586586413a182`

### Accounts — Phase 1A: compatibility foundation

Module commit: `67dfae3e3621189b0288ceb0b9f3118da551f0fd`

- Created `src/features/accounts/accounts.js`.
- Added pure helpers for account type/classification, default selection, opening/account totals, transfer history and deactivation eligibility.
- Prepared HTML loads Accounts after Core and delegates the smallest pure callers.

### Accounts — Phase 1B: metadata normalization + regression harness

Module update commit: `b57ab57d250d99894d2e6079e87efce07dc456e6`
Regression-test commit: `d50df6233d1e2563a6ab18e976f9cc679f94dec2`

- Extended `MongoAccounts` with pure metadata/bootstrap helpers:
  - `earliestTransactionDate()`
  - `makeLegacyAccount()`
  - `normalizeMetadata()`
  - `ensureLegacyAccount()`
  - `assignMissingTransactionAccounts()`
- Legacy `bank` continues to normalize to `checking`.
- Opening balances are normalized as non-negative numeric metadata; existing explicit `active:false` is preserved.
- Legacy bootstrap preserves `legacy_main`, cash type, earliest transaction start date and existing opening-balance semantics.
- Added `tests/accounts/accounts.test.js` covering type normalization, metadata normalization, legacy bootstrap, missing transaction-account assignment, internal-transfer total conservation, deactivation eligibility and transfer history.
- Prepared `index.modular-accounts-phase1b.html` from the exact Phase 1A file.
- `ensureMoneyAccounts()` now delegates metadata/bootstrap/default transaction-account assignment/opening total to `MongoAccounts`, while preserving the existing legacy-account auto-deactivation check inline.
- Account create/edit/deactivate mutations, rendering, persistence and Firebase remain inline.
- Static syntax validation of the prepared Phase 1B HTML: 44 non-empty inline JavaScript blocks, 0 syntax errors.

Execution note: static syntax validation has been executed locally. GitHub Node regression suites and browser/runtime parity still require an executable checkout/app environment before production/main integration; do not record them as executed yet.

## Current state

Accounts now owns pure account identity/type/metadata normalization/bootstrap and account-facing read helpers. Riskier account mutations are still protected behind existing inline compatibility code.

## NEXT STEP

### Accounts — Phase 1C: opening-balance and deactivation mutation boundaries

1. Extract pure helpers for opening-balance edits: calculate delta/resulting balance and recompute aggregate opening total without persistence/UI side effects.
2. Add regression cases proving an opening-balance edit changes only that account's opening contribution and does not rewrite historical transactions/transfers.
3. Inspect `archiveMoneyAccount()` and preserve the current rule for historical ledger entries; do not delete history when deactivating.
4. Delegate only calculation/eligibility portions of edit/deactivation; keep confirmation dialogs, rendering and `saveData()` inline.
5. Keep Firebase/cloud untouched.
6. Re-run static syntax checks; run stored Node/browser suites when an executable checkout is available.

## Future order

Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule

At the end of every modularization session, update this document with what changed, commit SHA(s), tests performed, unresolved risks, and the exact next step.
