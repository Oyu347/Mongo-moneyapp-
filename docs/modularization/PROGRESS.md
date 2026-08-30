# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE.

### Cloud — Phase 1A
Module `aa4509b2c80e519366dd487ff5a87d7c41f073ad`; tests `d47302aec6b474b867865defd6da98e5d52f1f35`.

### Cloud — Phase 1B
Module `5c47fc30bb3ec0b3746fbcada57de6515698f605`; tests `fe11dc0ed3b9e855abc10c919ca2fbcd242247d7`.

### Cloud — Phase 1C: write payload / mirror policy
Module: `5ad246710ae50969f26ddbd899382d73fbe2c417`
Tests: `3a56d1ad66d2351b4bb5686914e0b16e13bfbe7d`

- Fingerprint skip policy is now pure: unchanged data may skip ordinary saves, but mirror-required reasons still write.
- Mirror-required reasons preserved exactly: `force`, `login-mirror`, `legacy-path-migration`, `first-cloud-migration`, `bootstrap-mirror`, `clear-tombstone`.
- `clear-tombstone` therefore cannot be suppressed merely because its data fingerprint matches the last Cloud fingerprint.
- Pure write metadata builder now owns owner/version/client timestamp/client ID/operation ID/data/backup shape and tombstone `clearedAt` selection.
- Firebase server timestamp remains injected inline, preserving Firestore-specific behavior outside the pure module.
- All canonical and compatibility mirror `.set()` calls remain inline and unchanged: appState, financial, settings, profile and user-root.
- Prepared `index.modular-cloud-phase1c.html` with bounded fingerprint and payload-metadata delegations.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Cloud Node regression suite and browser/Firebase runtime parity are not recorded as executed.

## Current state
Cloud pure boundary now covers local/cloud ordering, reset barrier, stale queue rejection, fingerprint/mirror policy and write metadata. Firebase I/O remains inline.

## NEXT STEP
### Cloud — Phase 1D: load candidate normalization
1. Inspect exact appState/financial/settings/profile/root read candidate construction and compatibility unwrap behavior.
2. Extract pure candidate normalization/validity helpers only.
3. Preserve newest-candidate ordering and clear-barrier precedence.
4. Keep Firestore `.get()` calls, auth gates, apply-to-local side effects and UI inline.
5. Add focused compatibility-candidate regression tests and static syntax validation.

## Future order
Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
