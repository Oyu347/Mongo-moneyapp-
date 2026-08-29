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
- Added a safe compatibility API for local storage access.
- Prepared a full uploaded `index.html` variant that loads the storage module and migrates a small first group of local persistence callers.
- Firebase queue/snapshot/cloud synchronization remains separate for later `services/cloud` extraction.
- Existing migration notes: `src/services/storage/MIGRATION.md`.

Important: the full prepared modular HTML is not committed through the GitHub contents connector because the monolithic file is too large to safely round-trip through that path. Always verify the exact full working HTML before a replacement.

### Core — Phase 1A: unified ledger foundation

Commit: `61164ec3277107b9ca6f71d098e680a31e963b73`

- Created `src/core/ledger.js` as a compatibility-first pure financial core module.
- Mirrored V44 unified-ledger kinds and mapping rules.
- Added builders for transactions, transfers, loan funding and loan payments.
- Added ledger construction, account-balance calculation, total-account-money calculation, validation, expected IDs and rebuild detection.
- UI rendering, persistence and Firebase remain outside core.
- Existing inline unified-ledger implementation remains authoritative until migration is proven stable.

### Core — Phase 1B: integration checkpoint

Regression-test commit: `a64d312ce0c9a9c17f396bd52f282c35862bc0b1`

- Prepared `index.modular-core-phase1b.html` from the exact uploaded modular-storage HTML by adding `<script src="src/core/ledger.js"></script>` immediately before the existing `mongo-v4411-unified-money-ledger` compatibility script.
- Kept the existing inline unified-ledger code intact; no live caller has been deleted or replaced yet.
- Re-ran syntax parsing over the prepared HTML inline scripts: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Added `tests/core/ledger.test.js` for deterministic core invariants: income/expense account effects, Bank ↔ Cash transfer conservation, savings transfer classification, loan funding/payment effects, loan split equality, no duplicate ordinary expense for loan interest, validation and rebuild detection.
- The GitHub regression test is ready to run with `node tests/core/ledger.test.js` in a checked-out repository. The current connector/runtime cannot execute the connected GitHub checkout directly, so do not record it as executed yet.

## Current state

Storage foundation is ready. `src/core/ledger.js` exists and a full prepared HTML now loads it before the legacy inline ledger implementation. Static JavaScript syntax validation passes. Core regression tests are stored in GitHub. Caller migration is intentionally not started until parity is confirmed in an executable checkout/browser test.

## NEXT STEP

### Core — Phase 1C: execute parity tests, then migrate smallest callers

1. Run `node tests/core/ledger.test.js` in an environment with the `development-modular` checkout.
2. Open the prepared full app and compare `MongoLedgerCore.buildLedger()` output against the current inline `moneyLedger` for IDs, kinds, amounts, account directions and loan splits.
3. Compare `MongoLedgerCore.accountBalance()` against current `accountBalance()` for every money account.
4. Confirm internal transfer total-money conservation and no duplicate loan-interest expense.
5. If parity succeeds, migrate only the smallest safe pure callers first (ledger kind mapping/build helpers and balance calculation), while retaining compatibility wrappers.
6. Re-run syntax and financial regression checks.
7. Only then proceed toward Accounts.

## Future order

Core → Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule

At the end of every modularization session, update this document with:
- what changed,
- commit SHA(s),
- tests performed,
- unresolved risks,
- exact next step.

This prevents a new chat/session from guessing where the work stopped.