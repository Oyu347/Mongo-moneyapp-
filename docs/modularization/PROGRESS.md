# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE; i18n Phase 1 COMPLETE.

### i18n phases
- 1A module `ad652928caea8b87ca488ef4c2953938aedb99d4`; tests `2dd4ccbd0917a3eca50b9d6dfe0d0b687a2fc509`.
- 1B module `268c2946ca15f2ae0b559699e5656c388add6102`; tests `9a677020890563471f9ee9fc4151b4bc8188dce4`.
- 1C module `16314de31cee773c29a9430f851af23b1c13d9cb`; tests `12c912b833726f731de459310aa56b37e1f20d61`.
- 1D dictionary boundary `54491af0480a87a17dc0acc8aeb4fce3b1395a1d`; tests `97437f08560ddab149083617a0b1b509de140bcd`.
- 1E exact physical dictionary extraction `6ce5530642cfe400073dfa0271c9fddf5627a407`.

### i18n — Phase 1E closure
- Physically moved the exact final seven-language `LANGS` payload into `src/i18n/dictionaries.js` from the trusted full local HTML.
- The prepared HTML now references `const LANGS=window.MongoDictionaries.LANGS;`; the original large base dictionary declaration and all seven `Object.assign(LANGS.<locale>, ...)` extension patches were removed from the HTML copy.
- Extraction evaluated the original base object plus all seven patches in source order before writing the external module, so duplicate-key JavaScript semantics are preserved exactly.
- Final extracted dictionary payload remains: mn 102 keys, en 102, zh 102, ja 102, ko 102, ru 98, de 95. No translations were invented, corrected or silently filled.
- Semantic parity was verified immediately before extraction: exact final dictionary JSON matched the Phase 1D source payload (23,438 characters).
- Prepared `index.modular-i18n-phase1e.html`.
- Static syntax validation executed after physical removal: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- HTML contains one module-owned `LANGS` reference and zero remaining `Object.assign(LANGS.<locale>, ...)` patches.
- `CAT_LABELS`, currency compatibility constants outside the extracted payload, investment-type tables, DOM `applyLang()`, persistence and UI handlers remain in their existing boundaries; they were not expanded into this closure without separate parity proof.
- Browser/runtime seven-language parity was not executed.

## Current state
i18n Phase 1 is closed. The main seven-language dictionary payload is physically modularized, lookup compatibility is available through `MongoI18n`, and the trusted full HTML no longer owns that extracted payload.

## NEXT STEP
### Web — Phase 1A: browser/platform boundary inventory
1. Inspect browser-only helpers and global event/bootstrap code in the latest prepared HTML.
2. Separate pure web/platform capability checks from financial feature logic; do not move Firebase/cloud or financial calculations into Web.
3. Inventory PWA/install/share/download/file APIs, DOM/browser globals, navigation/history and other web-only behavior before extraction.
4. Create the first `src/web/` compatibility module only for a small parity-safe boundary.
5. Add focused tests where practical and run static syntax validation.

## Future order
Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
