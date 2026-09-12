# Möngö — CURRENT WORK

> Энэ файл нь шинэ чат, шинэ agent, шинэ хөгжүүлэлтийн мөчлөг бүрийн ЭХНИЙ УНШИХ заагч.
> Энд дэлгэрэнгүй түүх хадгалахгүй. Зөвхөн яг одоо хаана, юун дээр ажиллаж байгааг заана.

## ACTIVE WORK

- **Repository:** `Oyu347/Mongo-moneyapp-`
- **Pointer home:** `development-modular`
- **ACTIVE BRANCH:** `feature/completed-cards-archive`
- **Verified production lineage:** `V44.12.30`
- **Last phone-confirmed checkpoint:** `38.2g` — early-cancellation calculator opens and known Mongolian calculation case produces a result.
- **Current target:** `V38.2h` — 7-language early-cancellation UI + live thousands separators for money-entry fields.
- **Status:** `PATCH STAGED / NEEDS PHONE TEST`

## CURRENT AREA

**Savings → Calculator → Early cancellation (Хугацаанаас өмнө цуцлах).**

User-confirmed remaining issues from V38.2g:
1. Newly added early-cancellation UI is not yet translated in all 7 languages.
2. Money-entry fields should show thousands separators while typing (example: `12500000` → `12,500,000`).
3. Percent and date fields must remain unchanged.
4. Preserve the V38.2g calculation formula and all unrelated app behavior.

V38.2h patch is scoped only to these items. Phone-test language switching, comma formatting, and the known calculation case before moving on.

## START HERE — EVERY NEW CHAT

1. Read this file first from `development-modular`.
2. Go directly to the `ACTIVE BRANCH` named above.
3. Read that branch's `docs/MONGO_AGENT_WORKBOOK.md`.
4. Read the latest relevant section at the bottom of `docs/modularization/PROGRESS.md` and `ROADMAP.md`.
5. Inspect the ACTIVE BRANCH head and the latest relevant commits.
6. Identify the latest `PHONE PASS`, `PHONE FAIL`, `NEEDS TEST`, or other explicit evidence.
7. Continue from that exact checkpoint. Do not restart from `main` or from an older milestone.

## POINTER UPDATE RULE — REQUIRED

Whenever active development moves to another feature/integration branch, update this file on `development-modular` immediately so `ACTIVE BRANCH`, current area/task, latest known checkpoint, status, and next step point to the new work.

Whenever a meaningful phone test changes the current state, update the active branch journal first; then update this pointer if the current task/status/next step changed materially.

`CURRENT_WORK.md` is the navigation pointer only:
- Full attempted/completed history → active branch `docs/modularization/PROGRESS.md`
- Future/next work → active branch `docs/modularization/ROADMAP.md`
- Agent rules and protected behavior → active branch `docs/MONGO_AGENT_WORKBOOK.md`

## SAFETY

- This pointer does **not** promote the feature branch to verified baseline.
- Do not modify `main` merely because this file points to a feature branch.
- Do not overwrite the verified V44.12.30 lineage without user-approved verification.
- One ACTIVE development task at a time unless the user explicitly chooses otherwise.

---
Updated: 2026-09-12
