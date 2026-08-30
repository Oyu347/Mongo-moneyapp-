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
- 1D dictionary boundary `54491af0480a87a17dc0acc8aeb4fce3b1395a1d`; tests `97437f08560ddab149083617a0b1b509de140bcd`.

### i18n — Phase 1D: safe dictionary ownership boundary
- Added `src/i18n/dictionaries.js` as the dedicated dictionary registry/ownership boundary, separate from lookup/fallback logic in `i18n.js`.
- Latest full HTML now loads `dictionaries.js` before `i18n.js` and registers the exact existing `LANGS` object through `MongoDictionaries.register(...)`.
- Translation text remains in the trusted full HTML for this bounded phase; it has not yet been physically deleted from the large HTML. This avoids a risky large-text move through the GitHub connector before the external payload is committed and verified.
- All seven later `Object.assign(LANGS.<locale>, ...)` extension patches remain in their original order and operate on the same registered object.
- Local semantic parity harness evaluated the complete base dictionary plus all seven extension patches before and after registration-boundary migration. Final JSON was exactly equal (23,438 characters).
- Key counts remain: mn 102, en 102, zh 102, ja 102, ko 102, ru 98, de 95. No translations were invented or silently filled.
- Prepared `index.modular-i18n-phase1d.html`.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Browser/runtime seven-language parity was not executed.

## Current state
i18n dictionary ownership is modularized and semantically parity-checked, while physical dictionary text extraction remains intentionally staged to protect the trusted full HTML.

## NEXT STEP
### i18n — Phase 1E: physical dictionary extraction + closure
1. Move the exact registered `LANGS` payload and extension patches into the dedicated dictionary module using the trusted local extraction result; remove only those exact source ranges from the prepared HTML after external payload availability is verified.
2. Consider `CAT_LABELS`/currency/investment-type tables only if their extraction can be independently parity-proven; otherwise leave them for a later i18n phase rather than expanding closure risk.
3. Execute semantic seven-language parity and static syntax validation again.
4. Close i18n Phase 1 only when the prepared HTML no longer owns the extracted dictionary payload and the module load order is self-sufficient.
5. Then begin Web Phase 1A.

## Future order
i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
