# Möngö Development Agent — CURRENT STATE

> Энэ файл нь шинэ чат, шинэ agent session эхлэхэд хамгийн сүүлийн бодит ажлаас шууд үргэлжлүүлэх handoff баримт бичиг.
> `MONGO_AGENT_WORKBOOK.md`-ийн дүрмийг үргэлж дагана. Энэ файл verified baseline-ийг өөрөө өөрчлөх эрхгүй.

## New chat startup flow

Хэрэглэгч “Möngö Agent, үргэлжлүүлье” эсвэл түүнтэй адил утгатай хүсэлт өгвөл:

1. Repository `Oyu347/Mongo-moneyapp-` мөн эсэхийг GitHub-аас шалга.
2. `docs/MONGO_AGENT_WORKBOOK.md` унш.
3. Энэ `docs/CURRENT_STATE.md`-ийг унш.
4. `docs/modularization/PROGRESS.md`-ийн хамгийн сүүлийн checkpoint болон тухайн асуудалтай холбоотой өмнөх шийдлүүдийг унш.
5. Шаардлагатай бол `RULES.md`, `ROADMAP.md`, `ARCHITECTURE.md` унш.
6. `Next exact action`-аас үргэлжлүүл.
7. GitHub-д аль хэдийн байгаа repository/branch/version/commit/өмнөх шийдлийг хэрэглэгчээс дахин нэхэхгүй.
8. Код өөрчлөхөөс өмнө асуудлын root cause болон өөрчлөх хамгийн бага scope-ийг тогтоо.
9. Verified/working behavior-ийг хамгаална.
10. Session дуусах бүрд CURRENT_STATE болон шаардлагатай үед PROGRESS-ийг шинэчилж дараагийн session-д handoff үлдээнэ.

## Source of truth

- Repository: `Oyu347/Mongo-moneyapp-`
- Verified lineage: `V44.12.30`
- Verified baseline commit: `7ea64684074f6f5f33ee3b65d4abddcc70bbc53d`
- Workbook normal working branch: `development-modular`
- Current experimental/debug branch: `fix/safe-delete-all-data`
- Experimental branch must NOT silently replace the verified baseline.
- Do NOT modify `main` or production as part of this investigation.

## Current status

**Status:** 🔴 BLOCKED / INVESTIGATING

### Current problem
Delete All Data / Cloud clear work exposed a startup/data-persistence regression on the safe branch.

Observed user-facing result:
- A disposable test account previously contained about ₮448,000 of data.
- On a fresh Vercel Preview, BEFORE pressing Delete All Data, the account opened with zero/empty financial state.
- Cloud indicator appeared green.
- Therefore Delete All Data must NOT be considered verified and Delete testing must not continue until startup persistence is understood.

### Last targeted change
- Commit under investigation: `613b9cc` — `Restore stable Cloud client ID helper`.
- Intended scope was only restoring the missing Cloud client-ID helper on `fix/safe-delete-all-data`.
- This change is NOT a verified baseline.

## Protected state — DO NOT DO during current investigation

- Do NOT press Delete All Data on the current disposable account.
- Do NOT add new test data to that account yet.
- Do NOT treat the empty dashboard as proof that Delete succeeded.
- Do NOT modify `main` or production.
- Do NOT promote/merge the safe branch into `development-modular`.
- Do NOT change financial formulas, seven-language behavior, branding, Accounts/Transfers/Budget/Savings/Loans/Investments while diagnosing this startup issue.
- Do NOT replace the verified V44.12.30 baseline.

## Relevant prior checkpoint

`docs/modularization/PROGRESS.md` contains the earlier Cloud Clear/Reset Phase 2 solution and must be consulted before changing reset logic. It records:
- authoritative active local clear barrier;
- five Firebase financial mirrors: `appState`, `financial`, `settings`, `profile`, `user-root`;
- strict clear verification before barrier release;
- `PARTIAL_CLOUD_MIRROR_WRITE` handling;
- commits `5ad1ad79e53b8d3a37421691df37794134d37e02`, `a3788eefd12ccd325010e1813e45cd14c82015fb`, `a0e463ef4faa553a361115abfc1b27669e6d7ac7`.

Do not reinvent or bypass this design without evidence that it is the root cause.

## Investigation hypotheses

Determine which of these actually occurred; do not guess:

1. Empty local startup state was saved to Cloud before the first Cloud load and overwrote existing data.
2. A previous clear barrier/tombstone/quarantine state was applied on startup and suppressed/cleared the old data.
3. `getClientId()` produced or selected a different client/device identity, causing the app to read/write a different Cloud namespace or record.
4. Another startup ordering or candidate-selection regression exists.

Important: a Vercel Preview has its own origin. If client ID is stored in origin-scoped browser storage, a new Preview URL may create a new ID. This is only a hypothesis until the actual Cloud document/key contract is inspected.

## Next exact action

**INSPECT ONLY — no code change yet.**

1. Fetch commit `613b9cc` and its parent in `Oyu347/Mongo-moneyapp-`.
2. Compare the exact diff and identify the actual `cloud.js` path/functions changed.
3. Trace the safe-branch startup sequence in order:
   - authentication/user resolution;
   - client/device ID resolution;
   - local-state initialization;
   - clear barrier/tombstone/quarantine checks;
   - first Cloud read/load;
   - candidate/conflict selection;
   - first save and queued-save flush.
4. Determine whether data is actually deleted/overwritten in Firebase, hidden behind another namespace/client ID, or blocked by clear-state logic.
5. Report evidence and the smallest safe fix scope BEFORE editing code.

## Completion rule for current issue

This issue may move out of BLOCKED only after:
- root cause is evidenced;
- minimal safe fix is applied on the experimental branch only;
- relevant automated/static checks pass;
- fresh Preview opens without losing existing data;
- refresh/re-login preserves data;
- only then may Delete All Data testing resume;
- Delete All Data becomes VERIFIED only after user-facing test confirms all intended data stays deleted and no stale Cloud mirror resurrects it.

## Session handoff rule

At the end of each meaningful work session update this file with:
- current branch + commit;
- what was inspected/changed;
- test result;
- user test result if any;
- VERIFIED / NEEDS TEST / BLOCKED status;
- one exact `Next exact action`.

If a result becomes a durable verified checkpoint, also append it to `docs/modularization/PROGRESS.md` rather than keeping history only here.

---

Last updated: 2026-09-06
Status: BLOCKED / INVESTIGATING — startup/data persistence regression before Delete test
