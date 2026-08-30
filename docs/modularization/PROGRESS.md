# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE; Cloud Phase 1 COMPLETE; Audit Phase 1 COMPLETE; i18n Phase 1 COMPLETE.

### Web — Phase 1A: browser/platform compatibility
Module `de803b48cfc982be2230df5bef208bd966c97251`; tests `f07d889804efd38a26d93b6f9fd43da95393df4`.

- Inventoried browser-only APIs in the latest prepared full HTML. No service-worker, `beforeinstallprompt`, `navigator.share`, clipboard or `matchMedia` use is currently present.
- Current relevant browser boundaries include backup download (`Blob`, `URL.createObjectURL`, anchor download), backup import (`FileReader`), reload/location, online/offline state, visibility/focus/page lifecycle hooks and DOM creation/event code.
- Added `src/web/platform.js` with small compatibility helpers for capability detection, text download, text-file reading and reload. It contains no financial, Firebase, storage or UI-policy logic.
- Migrated only backup export's direct Blob/object-URL/anchor construction to `MongoWeb.downloadText(...)`. Backup data selection, naming, messages and storage behavior remain inline.
- Backup import remains inline in Phase 1A because its `FileReader` callback immediately crosses security parsing, local persistence, Cloud restore and reload boundaries; it needs a more careful callback-only migration.
- Prepared `index.modular-web-phase1a.html` and loaded `src/web/platform.js` after i18n modules.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- After migration there are zero direct `new Blob(...)` calls in the prepared HTML and one direct `new FileReader(...)` call remaining for restore import.
- Web Node regression test file was committed but is not recorded as executed. Browser/runtime download/import parity was not executed.

## Current state
Web Phase 1A has a bounded browser-platform compatibility module and one safe real caller migration. Financial and Cloud behavior remain outside Web.

## NEXT STEP
### Web — Phase 1B: file-read and navigation boundary
1. Delegate only the raw browser `FileReader.readAsText` mechanics in `importData()` to `MongoWeb.readTextFile`, keeping security parsing, persistence, Cloud restore and UI messages inline.
2. Inventory direct reload/location uses and migrate only generic reload mechanics where exact timing parity is clear.
3. Do not move password-reset URL construction, Firebase auth redirects or Cloud online/offline policy into Web merely because they reference browser globals.
4. Add focused tests and static syntax validation.

## Future order
Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
