# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE.

### i18n phases
- 1A module `ad652928caea8b87ca488ef4c2953938aedb99d4`; tests `2dd4ccbd0917a3eca50b9d6dfe0d0b687a2fc509`.
- 1B module `268c2946ca15f2ae0b559699e5656c388add6102`; tests `9a677020890563471f9ee9fc4151b4bc8188dce4`.
- 1C module `16314de31cee773c29a9430f851af23b1c13d9cb`; tests `12c912b833726f731de459310aa56b37e1f20d61`.

### i18n — Phase 1C: exact missing-key fallback handling
- Inspected runtime uses of the seven known Russian/German dictionary gaps rather than inventing translations.
- `investedAmt`, `currentVal`, and `investDate` are used in investment detail labels with explicit current-language fallbacks to `invested`, `curval`, and `deadline`. Migrated these three expressions to `MongoI18n.ownValue()` while preserving that exact fallback behavior; importantly, this does not switch missing German labels to Mongolian.
- `dataLoaded` has two runtime toast uses with explicit Mongolian/Cloud fallback strings. Migrated both to `ownValue()` preserving the exact existing fallback strings.
- `noBackup`, `backupOk`, and `fileErr` currently have no direct runtime `L.<key>` use found in the latest full HTML; they remain recorded gaps and were not filled.
- Added pure `ownValue(dictionary,key,fallback)` specifically for exact current-language fallback semantics, distinct from cross-language `value()` fallback.
- No translation strings were changed or added.
- Prepared `index.modular-i18n-phase1c.html`.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- i18n Node regression test file was committed but is not recorded as executed. Browser/runtime seven-language parity was not executed.

## Current state
i18n now has explicit helpers for both cross-language compatibility lookup and exact current-language fallback, with known Russian/German gaps handled conservatively where they are actually used.

## NEXT STEP
### i18n — Phase 1D: dictionary extraction boundary
1. Extract exact dictionary constants from the trusted full local HTML into a dedicated `src/i18n/dictionaries.js` only if byte/semantic parity can be validated locally.
2. Include `LANGS`, `CAT_LABELS`, currency mapping and other clearly language-only lookup tables; keep financial/UI logic out.
3. Preserve all later `Object.assign(LANGS.<locale>, ...)` patches in exact order or fold them only after semantic parity proof.
4. Update HTML to consume the external dictionaries without changing translation text.
5. Run seven-language key parity plus static syntax validation; do not claim browser parity unless actually run.

## Future order
i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
