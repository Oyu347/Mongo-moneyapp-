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

### Core — Phase 1: COMPLETE

Core foundation and tests:
- Created `src/core/ledger.js` as a pure compatibility-first financial core.
- Added deterministic regression and frozen-reference parity harnesses under `tests/core/`.
- Core owns ledger kind mapping, entry construction, complete ledger building, account-balance calculation, validation, expected ledger IDs and rebuild detection.

Progressive prepared-HTML migration:
- Phase 1B linked `src/core/ledger.js` before the legacy unified-ledger script.
- Phase 1C delegated kind mapping and account-balance calculation.
- Phase 1D delegated all four ledger-entry builders.
- Phase 1E delegated `syncLedgerFromViews()` construction to `MongoLedgerCore.buildLedger()` while preserving legacy loan-payment cleanup.
- Phase 1F delegated `validateLedger()` to `MongoLedgerCore.validateLedger()`, `expectedLedgerIds()` to the core expected-ID helper, and `ensureUnifiedLedger()` rebuild detection to `MongoLedgerCore.needsRebuild()`.
- Compatibility/public function names remain in the monolithic HTML for rollback safety.
- `projectViewsFromLedger`, persistence, Firebase and UI mutation code remain outside Core and were intentionally not moved.
- Prepared Phase 1F HTML static syntax validation: 44 non-empty inline JavaScript blocks, 0 syntax errors.

Key commits:
- Core foundation: `61164ec3277107b9ca6f71d098e680a31e963b73`
- Regression test: `a64d312ce0c9a9c17f396bd52f282c35862bc0b1`
- Parity harness: `b954b26929ae18ed6b651898a16586586413a182`

Execution note: static syntax checks have been executed locally. The committed Node regression/parity tests and browser runtime parity still require an executable checkout/app environment before production/main integration. Do not treat static syntax success alone as runtime proof.

## Current state

Storage Phase 1 and Core Phase 1 modular foundations are complete on `development-modular`. The next dependency in the approved roadmap is Accounts. The monolithic prepared HTML retains compatibility wrappers, so the migration remains rollback-safe.

## NEXT STEP

### Accounts — Phase 1A: identify boundaries and create compatibility module

Target: `src/features/accounts/accounts.js`

Inspect the exact latest prepared full HTML and identify account-owned behavior before extraction:
- account creation/edit/deactivation,
- opening balance and account start date,
- account type (cash/checking/savings where represented),
- account balance access through Core ledger,
- account history and inter-account movement presentation,
- account selection/source/destination helpers used by Transactions,
- any refresh/re-login normalization that affects account metadata.

Rules for Accounts Phase 1A:
1. Do not duplicate ledger calculations inside Accounts; call `MongoLedgerCore` for balances.
2. Keep Transfers as transaction/ledger movement; Accounts owns account metadata and account-facing views, not transfer financial semantics.
3. Preserve opening-balance behavior and per-user persisted data format.
4. Do not mix Firebase/cloud extraction into Accounts.
5. Start with a compatibility API and migrate the smallest pure account helpers first.
6. Keep current inline account UI/mutation code until parity is proven.
7. Add focused account regression tests before migrating risky account mutations.

Acceptance targets for later Accounts phases:
- New account opening balance appears exactly once.
- Later-created account does not rewrite earlier financial history.
- Bank ↔ Cash remains an internal transfer.
- Refresh/re-login preserves account type and opening balance.
- Deactivation does not corrupt historical ledger entries.
- Account history reflects the intended inter-account movements without changing totals.

## Future order

Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule

At the end of every modularization session, update this document with what changed, commit SHA(s), tests performed, unresolved risks, and the exact next step. This prevents a new chat/session from guessing where the work stopped.