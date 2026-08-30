# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE.

### i18n phases
- 1A module `ad652928caea8b87ca488ef4c2953938aedb99d4`; tests `2dd4ccbd0917a3eca50b9d6dfe0d0b687a2fc509`.
- 1B module `268c2946ca15f2ae0b559699e5656c388add6102`; tests `9a677020890563471f9ee9fc4151b4bc8188dce4`.

### i18n — Phase 1B: lookup compatibility + real key parity inventory
- Direct inline language usage inventory: 229 `L.<key>` references across 140 unique keys. These remain mostly inline to keep this phase bounded.
- Migrated the central category display-name helper `cN()` to `MongoI18n.categoryLabel()` for built-in category labels and `MongoI18n.namedLabel()` for multilingual user-added names.
- `namedLabel()` preserves the existing fallback order for multilingual custom names: selected locale → mn → en → first available value → supplied fallback.
- No translation strings were rewritten or silently filled.
- Evaluated the actual current `LANGS` base object plus all seven later `Object.assign(LANGS.<locale>, ...)` extension patches in an isolated Node harness.
- Actual key counts against Mongolian reference (102 keys): mn 102, en 102, zh 102, ja 102, ko 102, ru 98, de 95.
- Actual missing Russian keys: `noBackup`, `backupOk`, `fileErr`, `dataLoaded`.
- Actual missing German keys: `investedAmt`, `currentVal`, `investDate`, `noBackup`, `backupOk`, `fileErr`, `dataLoaded`.
- These gaps are recorded only; Phase 1B does not invent translations. Existing inline fallback expressions remain responsible for current behavior where present.
- Prepared `index.modular-i18n-phase1b.html`.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- The isolated seven-language key-parity harness was executed successfully. The committed i18n Node regression test file itself is not recorded as executed. Browser/runtime seven-language parity was not executed.

## Current state
i18n lookup compatibility is active for central category naming, and the real seven-language dictionary gaps are now known without changing translations.

## NEXT STEP
### i18n — Phase 1C: exact gap handling and safe dictionary extraction boundary
1. Inspect every runtime use of the 7 known missing Russian/German keys and document its existing fallback behavior.
2. Add compatibility fallback through `MongoI18n.value()` only where it reproduces the existing UI result; do not invent translations.
3. Inventory the boundaries of the main `LANGS`, `CAT_LABELS`, currency and investment-type dictionaries for later extraction.
4. Keep large dictionary text inline unless extraction can be proven exact from the full local file.
5. Add focused tests and static syntax validation.

## Future order
i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
