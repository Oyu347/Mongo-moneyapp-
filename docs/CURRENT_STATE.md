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
- Current tested safe-delete commit: `07bb506cf98d75e2bb22065f503072526a68ad4f`
- Experimental branch must NOT silently replace the verified baseline.
- Do NOT modify `main` or production without separate approval.

## Current status

**Status:** 🟢 USER-VERIFIED ON SAFE VERCEL PREVIEW / NOT YET PROMOTED

### Root cause and correction

The earlier timeline is now corrected:
- The disposable account previously contained about ₮448,000.
- A Delete All Data attempt occurred BEFORE the `getClientId()` fix. The hard-reset sequence had already cleared local state before Cloud clear failed with `getClientId is not defined`; therefore the later empty dashboard was not evidence that commit `613b9cc` itself lost the data.
- Commit `613b9cc41cbcc981e751555df2b7e6d165b7c2c4` restored the stable Cloud client-ID helper in `src/services/cloud/cloud.js`.
- Full runtime inspection then identified a second legacy Cloud path: the V43.37 guaranteed financial sync directly read/wrote only `users/{uid}/financial/main` (plus a root fallback write), bypassing the modern five-mirror candidate/quarantine/clear-barrier/tombstone protections. It could race the canonical CloudDataService and resurrect stale state after a clear.
- Commit `07bb506cf98d75e2bb22065f503072526a68ad4f` (`Fix legacy V43.37 direct cloud sync`) disables that legacy direct single-mirror sync in `index.html` and leaves canonical CloudDataService authoritative.

## Protected behavior retained

The safe-delete fix did NOT intentionally change:
- five required Firebase financial mirrors: `appState`, `financial`, `settings`, `profile`, `user-root`;
- active local clear barrier;
- clear tombstone behavior;
- strict read-back verification;
- 4.5-second quarantine for in-flight autosaves;
- two-pass clear/final verification;
- financial formulas, Accounts/Transfers/Budget/Savings/Loans/Investments;
- seven-language behavior or branding.

## User validation — 2026-09-06

Validated on Android phone and safe Vercel Preview for `fix/safe-delete-all-data`:

1. Patched local HTML opened normally; core UI/navigation rendered normally — PASS.
2. Fresh safe Vercel Preview opened the disposable account at the expected current empty state — PASS.
3. Refresh + waiting did not resurrect the old stale data — PASS.
4. Logout/login did not resurrect the old stale data — PASS.
5. New controlled test state was created: opening balance ₮100,000, income ₮50,000, expense ₮10,000, resulting current balance ₮140,000 — PASS.
6. Delete All Data cleared the test state to ₮0 and removed account/transaction data — PASS.
7. Subsequent refresh did not resurrect the deleted test data — PASS.
8. Subsequent logout/login did not resurrect the deleted test data — PASS.

Result: the previously observed stale-Cloud resurrection was NOT reproduced after the V43.37 direct-sync fix. The safe Vercel Preview Delete All Data flow is user-verified for this controlled test.

## Relevant prior checkpoint

`docs/modularization/PROGRESS.md` contains Cloud Clear/Reset Phase 2:
- authoritative active local clear barrier;
- five Firebase financial mirrors;
- strict clear verification before barrier release;
- `PARTIAL_CLOUD_MIRROR_WRITE` handling;
- commits `5ad1ad79e53b8d3a37421691df37794134d37e02`, `a3788eefd12ccd325010e1813e45cd14c82015fb`, `a0e463ef4faa553a361115abfc1b27669e6d7ac7`.

Do not weaken or bypass this design.

## Next exact action

**DO NOT promote automatically.**

1. Preserve `07bb506cf98d75e2bb22065f503072526a68ad4f` as the safe-branch user-tested checkpoint.
2. Run/inspect relevant automated regression checks for the safe-delete branch and confirm no regression in Cloud reset wiring.
3. If checks are green, prepare a controlled comparison/integration plan from `fix/safe-delete-all-data` to `development-modular`.
4. Obtain user approval before merging/promoting the experimental fix.
5. Keep `main`/production untouched until a separately approved release step.

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
Status: USER-VERIFIED ON SAFE VERCEL PREVIEW — safe-delete stale-data resurrection not reproduced; promotion pending automated checks and explicit approval
