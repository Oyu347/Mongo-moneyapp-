# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE.

### Audit phases
- 1A module `97ca3963494ac942f33c91c994804621c57590b7`; tests `ced3c9bfc23cccd3af21aa9a9a51f2aab0439de5`.
- 1B module `1ad77152827a7706151b970413eea385ea1b73f3`; tests `b74d841f434c44e9e61df1a12831bbeedee555d1`.
- 1C module `facfac3f79975e1a67f9ef34fa96f76106794286`; tests `80fda5b73e5a1277edd63639f7e93ab40ed68720`.

### Audit — Phase 1C: source ↔ unified-ledger parity
- Added a pure source-ID builder that mirrors the exact Core Phase 1 ID contract for ordinary income/expense transactions, account transfers, eligible loan funding and debt payment rows.
- Historical transaction rows carrying `loanPaymentId` remain intentionally excluded from expected transaction-ledger IDs, matching Core behavior and avoiding a false duplicate/orphan signal.
- Added parity findings for expected source rows missing from the unified ledger.
- Added conservative orphan findings only for the exact Core-owned prefixes `txn:`, `transfer:`, `loan-received:` and `loan-payment:` when no corresponding current source exists.
- Unknown/future compatibility ledger prefixes are not labeled orphan, avoiding destructive assumptions about rows outside the current Core contract.
- Audit integration now supplies current debts to the read-only audit call.
- Findings only: no rebuild, deletion, persistence or UI mutation.
- Prepared `index.modular-audit-phase1c.html` with the debt/source parity integration.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Audit Node regression test file was committed but is not recorded as executed. Browser/runtime parity was not executed.

## Current state
Audit now covers source↔ledger identity parity in addition to balance, transfer, account-reference, loan-split and conservative double-count signals.

## NEXT STEP
### Audit — Phase 1D: severity/report normalization
1. Add pure summary/grouping helpers for error/warn findings without rendering UI.
2. Deduplicate identical findings emitted by overlapping audit checks.
3. Preserve full finding details and deterministic ordering for debugging/export later.
4. Keep audit read-only; no auto-fix or user-facing UI yet.
5. Add focused regression tests and static syntax validation.
6. Then perform Audit Phase 1 closure before i18n.

## Future order
Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
