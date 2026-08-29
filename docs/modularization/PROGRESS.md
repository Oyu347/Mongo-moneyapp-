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
- First small local-persistence callers prepared for migration.
- Firebase/cloud remains separate for later `services/cloud` work.

### Core — Phase 1: COMPLETE

- `src/core/ledger.js` owns pure unified-ledger kind mapping, entry construction, ledger building, account-balance calculation, validation and rebuild detection.
- Regression/parity harnesses exist under `tests/core/`.
- Prepared Phase 1F HTML delegates the selected compatibility wrappers to Core while leaving UI, persistence and Firebase outside Core.
- Static syntax validation passed with 0 errors.

Key commits:
- Core foundation: `61164ec3277107b9ca6f71d098e680a31e963b73`
- Regression test: `a64d312ce0c9a9c17f396bd52f282c35862bc0b1`
- Parity harness: `b954b26929ae18ed6b651898a16586586413a182`

### Accounts — Phase 1A: compatibility foundation

Module commit: `67dfae3e3621189b0288ceb0b9f3118da551f0fd`

- Created `src/features/accounts/accounts.js`.
- Accounts module deliberately does not recalculate financial ledger semantics. It calls `MongoLedgerCore.accountBalance()` for balances/totals.
- Added pure compatibility helpers for:
  - account-type normalization (`bank` legacy value → `checking`),
  - active/spendable/savings classification,
  - default account selection,
  - opening-balance totals,
  - ledger-derived account totals,
  - transfer-only account-history rows,
  - zero-balance eligibility check for deactivation.
- Inspected current account boundaries in the exact Phase 1F prepared HTML. Current inline account ownership includes `ensureMoneyAccounts`, legacy account bootstrap, selectors, transfer history display, create/edit/deactivate UI, opening balance totals and account classifications.
- Prepared `index.modular-accounts-phase1a.html` from the exact Phase 1F file and loaded `src/features/accounts/accounts.js` immediately after Core.
- Migrated only small pure compatibility callers in the prepared HTML:
  - `getDefaultAccountId()` → `MongoAccounts.defaultAccountId()`
  - `normalizeAccountType()` → `MongoAccounts.normalizeType()`
  - `accountRowsFor()` → `MongoAccounts.transferRows()`
  - spendable/savings predicates and account/opening totals → `MongoAccounts` helpers.
- Account creation, edit, deactivation mutation, legacy bootstrap, persistence, Firebase and rendering remain inline.
- Static syntax validation of the prepared Accounts Phase 1A HTML: 44 non-empty inline JavaScript blocks, 0 syntax errors.

Execution note: static syntax validation is complete. Browser/runtime parity and committed Node suites still need an executable app/checkout before production/main integration.

## Current state

Storage Phase 1 and Core Phase 1 foundations are complete. Accounts Phase 1A now has a rollback-safe compatibility module and the smallest pure callers are delegated in the prepared full HTML. Account mutations and persistence remain untouched.

## NEXT STEP

### Accounts — Phase 1B: account metadata normalization + regression tests

1. Add focused `tests/accounts/accounts.test.js` covering default account selection, legacy `bank` normalization, spendable/savings classification, opening totals, ledger-derived totals, transfer history and deactivation eligibility.
2. Extract a pure account normalization/bootstrap helper without persistence/UI side effects. Preserve the existing stored account object shape and legacy `legacy_main` behavior.
3. Keep `addMoneyAccount`, `editMoneyAccount`, `archiveMoneyAccount`, `saveData`, Firebase and UI rendering inline during this phase.
4. Delegate only metadata normalization/default assignment from `ensureMoneyAccounts()` after parity is established.
5. Verify that a later-created account opening balance appears once and does not rewrite older transaction history.
6. Re-run syntax/regression checks.

## Future order

Accounts → Transactions → Loans → Savings → Assets → Budget → Cloud → Audit → i18n → Web → Mobile.

## Handoff rule

At the end of every modularization session, update this document with what changed, commit SHA(s), tests performed, unresolved risks, and the exact next step.