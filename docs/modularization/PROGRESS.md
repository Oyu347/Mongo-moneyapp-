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

## Current state

Storage foundation is ready. The next dependency is Core.

## NEXT STEP

### Core — Phase 1: unified ledger

Target: `src/core/ledger.js`

Before writing:
- Inspect the latest exact working `index.html`.
- Identify the current unified-ledger functions, account-balance derivation, transaction normalization and their dependencies.
- Separate pure ledger calculations from UI rendering, persistence and Firebase code.

Implementation strategy:
- Start with a compatibility API/wrapper.
- Do not delete the current inline ledger implementation yet.
- Migrate a small set of callers only after the new module is linked.
- Verify balances and transaction totals before/after.

Acceptance checks:
- Income changes the selected account by the expected amount.
- Expense changes the selected account by the expected amount.
- Transfer decreases source and increases destination by equal amounts.
- Transfer does not change total money merely because money moved internally.
- Cash withdrawal/deposit behaves as Bank ↔ Cash transfer.
- Loan-related technical ledger entries do not become duplicate ordinary income/expense.
- Refresh preserves identical balances.

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