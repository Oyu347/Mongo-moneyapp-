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
- API includes get/set/remove and JSON helpers; later hardening added availability-safe access and utility helpers.
- Prepared a full uploaded `index.html` variant that loads `src/services/storage/storage.js` before the existing application scripts.
- Migrated a small first group of local financial persistence operations in that prepared variant: primary save/load, local clear, backup export and backup restore.
- Existing Firebase queue/snapshot/cloud synchronization logic was intentionally left out of Storage Phase 1 because it belongs under `services/cloud`.
- Inline JavaScript syntax validation was run on the prepared HTML with no syntax errors found.
- Existing migration notes: `src/services/storage/MIGRATION.md`.

Important: the full prepared modular-storage HTML was not committed through the GitHub contents connector because the monolithic file is too large to safely round-trip through that path. Do not assume GitHub `index.html` already contains every prepared caller migration; verify before continuing.

### Core — Phase 1A: unified ledger foundation

Commit: `61164ec3277107b9ca6f71d098e680a31e963b73`

- Created `src/core/ledger.js` as a compatibility-first, pure financial core module.
- Mirrored the current V44 unified-ledger kinds and mapping rules for ordinary income/expense, transfers, savings transfers, investment contributions, loan funding, loan payments, asset purchases/income and savings interest.
- Added pure builders for transaction, transfer, loan-funding and loan-payment ledger entries.
- Added `buildLedger()` for deriving ledger entries from the existing transaction/transfer/debt views.
- Added ledger-derived account balance and total-account-money calculations.
- Added ledger validation, expected-ID calculation and rebuild detection.
- Deliberately excluded UI rendering, local persistence and Firebase calls from the core module.
- Existing inline unified-ledger code remains authoritative for the live monolithic app until the new module is linked and tested. No legacy ledger code was deleted.

Source inspection confirmed that the current inline implementation derives every account balance from opening balance plus ledger inflows minus ledger outflows, and treats loan interest as a split of a single loan-payment ledger record rather than a duplicate transaction.

## Current state

Storage foundation is ready. Core Phase 1A pure ledger API is now present on `development-modular`, but it is not yet wired into the monolithic app.

## NEXT STEP

### Core — Phase 1B: link and parity-test `src/core/ledger.js`

Before changing callers:
- Use the exact latest working full `index.html` / prepared modular HTML.
- Load `src/core/ledger.js` before the existing V44.11 unified-ledger compatibility script.
- Keep the inline ledger implementation in place initially.

Parity tests:
- Build the same ledger with the existing inline logic and `MongoLedgerCore.buildLedger()` and compare IDs, kinds, amounts, account directions and loan splits.
- Compare `MongoLedgerCore.accountBalance()` against the current `accountBalance()` for every money account.
- Confirm no duplicate loan-interest transaction is introduced.
- Confirm transfer source/destination effects are equal and opposite.
- Confirm total money is unchanged by an internal transfer.

Only after parity succeeds:
- Migrate the smallest safe ledger callers to `MongoLedgerCore`.
- Run syntax/regression checks again.
- Do not delete the inline implementation until the replacement has proven stable.

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