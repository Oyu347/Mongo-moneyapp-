# Möngö Modularization Progress

This file is the handoff/checkpoint for every future modularization session. Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing work.

## Branch

`development-modular`

`main` is not the modularization work branch.

## Baseline

Modularization is based on the latest working V44-era monolithic `index.html`. When GitHub cannot return the complete large file, use the exact latest working upload rather than reconstructing/truncating it.

## Completed

### Storage — Phase 1

- Created `src/services/storage/storage.js`.
- Added a compatibility API for local storage access.
- Prepared a full uploaded HTML variant that loads the storage module and migrates a small first group of local persistence callers.
- Firebase queue/snapshot/cloud synchronization remains separate for later `services/cloud` extraction.
- Existing migration notes: `src/services/storage/MIGRATION.md`.

Important: prepared full modular HTML variants are not committed through the GitHub contents connector because the monolithic file is too large to safely round-trip through that path. Always verify/use the exact full working HTML before replacement.

### Core — Phase 1A: unified ledger foundation

Commit: `61164ec3277107b9ca6f71d098e680a31e963b73`

- Created `src/core/ledger.js` as a compatibility-first pure financial core module.
- Mirrored V44 unified-ledger kinds and mapping rules.
- Added builders for transactions, transfers, loan funding and loan payments.
- Added ledger construction, account-balance calculation, total-account-money calculation, validation, expected IDs and rebuild detection.
- UI rendering, persistence and Firebase remain outside core.

### Core — Phase 1B: integration checkpoint

Regression-test commit: `a64d312ce0c9a9c17f396bd52f282c35862bc0b1`

- Prepared `index.modular-core-phase1b.html` with `src/core/ledger.js` loaded immediately before the existing unified-ledger compatibility script.
- Kept existing inline unified-ledger code intact.
- Static parsing: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Added `tests/core/ledger.test.js` for deterministic financial invariants.

### Core — Phase 1C: parity harness + smallest caller migration

Parity-test commit: `b954b26929ae18ed6b651898a16586586413a182`

- Added `tests/core/ledger-parity.test.js` containing a frozen reference implementation of the current V44 inline ledger mapping/build/balance rules and assertions that `MongoLedgerCore` produces exactly the same ledger output and account balances for a representative state.
- Parity fixture covers ordinary income/expense, asset income, savings interest, ordinary transfer, savings transfer, investment contribution, asset purchase, loan funding, loan payment and exclusion of legacy `loanPaymentId` expense rows.
- Prepared `index.modular-core-phase1c.html` from Phase 1B.
- Migrated only the smallest pure inline callers in the prepared HTML:
  - `ledgerKindForTxn()` delegates to `MongoLedgerCore.ledgerKindForTransaction()`.
  - `ledgerKindForTransfer()` delegates to `MongoLedgerCore.ledgerKindForTransfer()`.
  - `ledgerBalance()` delegates to `MongoLedgerCore.accountBalance()`.
- Existing inline entry builders, ledger synchronization, view projection, persistence hooks and loan UI/payment mutation code remain unchanged.
- Re-ran static JavaScript syntax validation on the prepared Phase 1C HTML: 44 non-empty inline blocks, 0 syntax errors.

Execution note: GitHub tests are committed but connected GitHub itself is not an executable checkout. Do not claim browser/runtime parity is complete until the Node tests and the prepared app have been run in an appropriate executable environment. Static syntax validation has been executed locally.

## Current state

Core extraction is now partially wired in the prepared full HTML with a deliberately tiny compatibility surface. No legacy ledger synchronization/build code has been removed. This is the rollback-safe checkpoint before migrating entry builders/build synchronization.

## NEXT STEP

### Core — Phase 1D: execute parity suite and migrate ledger entry builders

1. Run `node tests/core/ledger.test.js` and `node tests/core/ledger-parity.test.js` in a checkout/runtime containing the GitHub module files.
2. If both pass, change the prepared HTML inline `makeTxnEntry`, `makeTransferEntry`, `makeFundingEntry`, and `makePaymentEntry` wrappers to delegate to `MongoLedgerCore` builders while preserving the existing function names and previous-entry timestamps.
3. Compare resulting ledger IDs/kinds/amounts/directions/loan splits with the frozen reference.
4. Keep `syncLedgerFromViews`, `projectViewsFromLedger`, `saveData` hook and UI mutation code intact during this phase.
5. Re-run syntax and financial regression tests.
6. Only after builder parity is proven, consider delegating `syncLedgerFromViews` to `MongoLedgerCore.buildLedger()`.

## Future order

Core → Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule

At the end of every modularization session, update this document with what changed, commit SHA(s), tests performed, unresolved risks, and the exact next step. This prevents a new chat/session from guessing where the work stopped.