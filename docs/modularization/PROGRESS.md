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

### Core — Phase 1A–1D

- Created `src/core/ledger.js` as a pure compatibility-first financial core.
- Added deterministic regression and parity harnesses under `tests/core/`.
- Prepared full HTML variants progressively delegating ledger-kind mapping, account balance, and all four ledger entry builders to `MongoLedgerCore`.
- Legacy public/local wrapper names and synchronization boundaries were preserved during migration.
- UI, Firebase and persistence remain outside core.

Key commits:
- Core foundation: `61164ec3277107b9ca6f71d098e680a31e963b73`
- Regression test: `a64d312ce0c9a9c17f396bd52f282c35862bc0b1`
- Parity harness: `b954b26929ae18ed6b651898a16586586413a182`

### Core — Phase 1E: ledger synchronization migration

- Prepared `index.modular-core-phase1e.html` from the exact Phase 1D prepared file.
- Kept the compatibility function name `syncLedgerFromViews()` but replaced its inline ledger-construction loop with:
  `MongoLedgerCore.buildLedger({txns, accountTransfers, debts}, moneyLedger)`.
- Preserved the existing post-build cleanup that removes legacy `loanPaymentId` transaction rows, preventing loan-interest duplication.
- Kept `projectViewsFromLedger`, save/persistence hooks, Firebase and UI mutation code unchanged.
- Static syntax validation of the prepared Phase 1E HTML found 11 non-empty inline JavaScript blocks in this exact file and 0 syntax errors. External scripts are not counted by this inline-block check.

Execution note: GitHub regression/parity tests still require an executable checkout/runtime. Do not record browser/runtime parity as complete until those tests and the prepared app are actually executed. Static syntax validation has been executed locally.

## Current state

Core now owns ledger kind mapping, ledger entry construction, complete ledger building, and account-balance calculation in the prepared full HTML. Compatibility wrappers remain in the monolithic file, which keeps rollback simple. Validation/rebuild-detection helpers are still inline.

## NEXT STEP

### Core — Phase 1F: migrate validation and rebuild detection, then close Core Phase 1

1. Keep the existing public function names `validateLedger()`, `expectedLedgerIds()` and `ensureUnifiedLedger()`.
2. Delegate validation to `MongoLedgerCore.validateLedger(moneyLedger)`.
3. Delegate expected-ID/rebuild logic to `MongoLedgerCore.expectedLedgerIds({txns, accountTransfers, debts})` and `MongoLedgerCore.needsRebuild(...)` while preserving the existing `priorSave()` behavior when a rebuild occurs.
4. Keep `projectViewsFromLedger`, persistence, Firebase and UI code unchanged.
5. Re-run static syntax checks and the stored Node regression/parity tests when an executable checkout is available.
6. If stable, mark Core Phase 1 complete and begin Accounts Phase 1 by identifying account/opening-balance/history boundaries without changing behavior.

## Future order

Core → Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule

At the end of every modularization session, update this document with what changed, commit SHA(s), tests performed, unresolved risks, and the exact next step. This prevents a new chat/session from guessing where the work stopped.