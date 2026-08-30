# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE.

### Audit phases
- 1A module `97ca3963494ac942f33c91c994804621c57590b7`; tests `ced3c9bfc23cccd3af21aa9a9a51f2aab0439de5`.
- 1B module `1ad77152827a7706151b970413eea385ea1b73f3`; tests `b74d841f434c44e9e61df1a12831bbeedee555d1`.

### Audit — Phase 1B: account balance and transfer conservation
- Added pure per-account ledger delta calculation from incoming minus outgoing ledger amounts.
- Added read-only account balance comparison: opening balance + ledger delta versus the balance returned by the existing Core-backed `ledgerBalance()` contract.
- Audit integration passes `ledgerBalance` into `MongoAudit`; Core remains the runtime source of truth for account balances.
- Added explicit internal-transfer conservation check. A valid Bank→Cash or any other account-to-account transfer produces `-amount + amount = 0` and no finding.
- Invalid transfer shape remains a separate finding path, so missing/same accounts are not misreported as conservation failures.
- Account references missing from the account collection remain separately reported.
- Findings only: no auto-fix, persistence or UI mutation.
- Prepared `index.modular-audit-phase1b.html` with the read-only balance callback integration.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Audit Node regression test file was committed but is not recorded as executed. Browser/runtime parity was not executed.

## Current state
Audit can now report ledger identity/reference issues, account-balance mismatches, transfer-shape/conservation issues, loan split mismatches and conservative loan/savings double-count signals without modifying data.

## NEXT STEP
### Audit — Phase 1C: cross-view parity checks
1. Compare source transaction/transfer/loan-payment IDs against their expected unified-ledger IDs without rebuilding data.
2. Add findings for ledger entries whose source view no longer exists (orphan ledger rows) where the Core ID contract is exact.
3. Keep historical compatibility rows that Core intentionally preserves out of false-positive orphan checks.
4. Findings only; no rebuild or deletion.
5. Add focused regression tests and static syntax validation.

## Future order
Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
