# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE.

### i18n — Phase 1A: seven-language compatibility foundation
Module: `ad652928caea8b87ca488ef4c2953938aedb99d4`
Tests: `2dd4ccbd0917a3eca50b9d6dfe0d0b687a2fc509`

- Exact current locale order/source inventory: `mn`, `en`, `zh`, `ja`, `ko`, `ru`, `de`; initial app state is `lang='mn'`, `L=LANGS.mn`, `CS='₮'`.
- Exact currency map preserved: mn ₮, en $, zh ¥, ja ¥, ko ₩, ru ₽, de €.
- Added `src/i18n/i18n.js` with pure locale normalization, dictionary selection, key lookup, category-label lookup, currency lookup and missing-key/key-parity diagnostics.
- Default compatibility fallback in the module is Mongolian (`mn`); current inline `setLang` only receives supported dropdown locales, so no user-visible fallback behavior is changed by Phase 1A.
- Main seven-language `LANGS`, category labels, investment-type translations and later `Object.assign(LANGS.<locale>, ...)` extension patches remain inline; no translation text was rewritten.
- DOM `applyLang()`, language dropdown state, document language attribute, render refreshes and Cloud profile-settings save remain inline.
- Prepared `index.modular-i18n-phase1a.html`; only runtime delegation made is currency symbol selection inside `setLang()` through `MongoI18n.currency(l)`.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- i18n Node regression test file was committed but is not recorded as executed. Browser/runtime seven-language parity was not executed.

## Current state
i18n has a pure compatibility foundation while the exact existing dictionaries and DOM behavior remain in the latest full HTML.

## NEXT STEP
### i18n — Phase 1B: key lookup compatibility migration
1. Inventory direct `L.<key>` and category-label lookup patterns that are safe to delegate without moving dictionaries.
2. Migrate a small bounded set of pure lookup/fallback expressions to `MongoI18n.value()` / `categoryLabel()` while preserving exact current values.
3. Do not migrate DOM rendering loops or rewrite translation strings yet.
4. Run missing-key parity diagnostics across all seven current dictionary objects in a safe local extraction/evaluation harness if possible; record actual gaps rather than silently filling them.
5. Add focused tests and static syntax validation.

## Future order
i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
