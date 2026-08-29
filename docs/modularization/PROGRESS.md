# Möngö Modularization Progress

This file is the handoff/checkpoint for every future modularization session. Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing work.

## Branch

`development-modular`

`main` is not the modularization work branch.

## Baseline

Modularization is based on the latest working V44-era monolithic `index.html`. When GitHub cannot return the complete large file, use the exact latest working upload rather than reconstructing/truncating it.

## Completed

### Storage — Phase 1

- Created `src/services/storage/storage.js` and a compatibility API for local persistence.
- Prepared a full HTML variant with the first small persistence caller migration.
- Firebase queue/snapshot/cloud synchronization remains separate for later `services/cloud` extraction.
- Existing migration notes: `src/services/storage/MIGRATION.md`.

Important: prepared full modular HTML variants are not committed through the GitHub contents connector because the monolithic file is too large to safely round-trip through that path. Always verify/use the exact full working HTML before replacement.

### Core — Phase 1A: unified ledger foundation

Commit: `61164ec3277107b9ca6f71d098e680a31e963b73`

- Created `src/core/ledger.js` as a compatibility-first pure financial core module.
- Added ledger mapping/builders, balance calculation, validation and rebuild detection.
- UI, persistence and Firebase remain outside core.

### Core — Phase 1B: integration checkpoint

Regression-test commit: `a64d312ce0c9a9c17f396bd52f282c35862bc0b1`

- Linked `src/core/ledger.js` before the existing unified-ledger compatibility script in the prepared full HTML.
- Added deterministic `tests/core/ledger.test.js`.
- Static parsing passed: 44 non-empty inline JavaScript blocks, 0 syntax errors.

### Core — Phase 1C: parity harness + smallest caller migration

Parity-test commit: `b954b26929ae18ed6b651898a16586586413a182`

- Added `tests/core/ledger-parity.test.js` with a frozen reference implementation of current V44 ledger rules.
- Prepared Phase 1C HTML delegates ledger-kind mapping and account-balance calculation to `MongoLedgerCore`.
- Legacy synchronization/build/view/persistence code remained intact.
- Static parsing passed: 44 non-empty inline blocks, 0 syntax errors.

### Core — Phase 1D: ledger entry builder migration

- Prepared `index.modular-core-phase1d.html` from the exact Phase 1C file.
- Preserved the legacy inline wrapper function names and synchronization flow, but changed the four entry builders to delegate to the extracted core:
  - `makeTxnEntry()` → `MongoLedgerCore.makeTransactionEntry()`
  - `makeTransferEntry()` → `MongoLedgerCore.makeTransferEntry()`
  - `makeFundingEntry()` → `MongoLedgerCore.makeLoanFundingEntry()`
  - `makePaymentEntry()` → `MongoLedgerCore.makeLoanPaymentEntry()`
- Each wrapper passes the existing `now()` timestamp into core so one entry creation uses one consistent timestamp and preserves previous `createdAt` behavior.
- `syncLedgerFromViews`, `projectViewsFromLedger`, `saveData` hook, persistence, Firebase and UI mutation code remain unchanged.
- Re-ran static JavaScript syntax validation: 44 non-empty inline blocks, 0 syntax errors.

Execution note: committed GitHub regression/parity tests still require an executable checkout/runtime. Do not record browser/runtime parity as complete until those tests and the prepared app are actually executed. Static syntax validation has been executed locally.

## Current state

Core kind mapping, account-balance calculation and all four ledger-entry builders are now delegated to `src/core/ledger.js` in the prepared full HTML. The legacy synchronization orchestration is intentionally retained as a compatibility boundary.

## NEXT STEP

### Core — Phase 1E: migrate ledger build/synchronization behind compatibility wrapper

1. Execute `tests/core/ledger.test.js` and `tests/core/ledger-parity.test.js` when an executable checkout is available.
2. In the prepared full HTML, keep the public/local function name `syncLedgerFromViews()` but delegate its ledger construction to `MongoLedgerCore.buildLedger({txns, accountTransfers, debts}, moneyLedger)`.
3. Preserve the current post-build cleanup that removes legacy `loanPaymentId` transaction rows.
4. Keep `projectViewsFromLedger`, persistence hooks and UI mutation code unchanged.
5. Re-run syntax checks and compare ledger IDs/kinds/amounts/account directions/loan splits.
6. If stable, migrate validation/rebuild-detection helpers next; only after that close Core Phase 1 and proceed to Accounts.

## Future order

Core → Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule

At the end of every modularization session, update this document with what changed, commit SHA(s), tests performed, unresolved risks, and the exact next step. This prevents a new chat/session from guessing where the work stopped.