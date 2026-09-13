# Möngö — CURRENT WORK

> Энэ файл нь шинэ чат, шинэ agent, шинэ хөгжүүлэлтийн мөчлөг бүрийн ЭХНИЙ УНШИХ заагч.
> Энд дэлгэрэнгүй түүх хадгалахгүй. Зөвхөн яг одоо хаана, юун дээр ажиллаж байгааг заана.

## ACTIVE WORK

- **Repository:** `Oyu347/Mongo-moneyapp-`
- **Pointer home:** `development-modular`
- **ACTIVE BRANCH:** `feature/completed-cards-archive`
- **Verified production lineage:** `V44.12.30`
- **Active branch checkpoint:** `2dbf956acaa5e82b69cc189747354bd0e7123c55` — `V11 restore +`
- **Last phone-confirmed checkpoint:** Restore/cloud conflict regression — `PHONE PASS` on 2026-09-13.
- **Current target:** return to the interrupted `V38.2h` work — 7-language early-cancellation UI + live thousands separators for money-entry fields.
- **Status:** `RESTORE INCIDENT CLOSED / V38.2h RESUMED / NEEDS PHONE TEST`

## CURRENT AREA

**Savings → Calculator → Early cancellation (Хугацаанаас өмнө цуцлах).**

Original work before the data incident:
1. Newly added early-cancellation UI needs confirmation in all 7 languages.
2. Money-entry fields should show thousands separators while typing (example: `12500000` → `12,500,000`).
3. Percent and date fields must remain unchanged.
4. Preserve the V38.2g calculation formula and all unrelated app behavior.

### INTERRUPTED / BRANCHED INCIDENT — CLOSED

While working on V38.2h, phone testing exposed data-loss/persistence concerns. The feature task was intentionally interrupted and investigation expanded through account/card persistence, Cloud mirroring, Backup, Delete All Data, and Restore.

2026-09-13 phone regression evidence:
- `PHONE PASS` new test data persisted before backup.
- `PHONE PASS` Backup completed.
- `PHONE PASS` Delete All Data completed.
- `PHONE PASS` Restore completed.
- `PHONE PASS` restored data remained after Refresh.
- `PHONE PASS` restored data remained after Logout → Login.
- `PHONE PASS` older/stale Cloud data did not overwrite the restored state in this tested flow.

Conclusion: the investigated Restore/cloud overwrite incident is CLOSED for the tested flow. This does **not** claim that every possible future data-loss condition is impossible. If new evidence appears, open a new incident and preserve this checkpoint.

### RETURN POINT

Resume the original V38.2h scope. Do not continue changing Restore/Delete/Cloud code without new evidence of regression. First confirm the current V38.2h implementation state on the active branch, then phone-test 7-language switching, live thousands separators, and the known early-cancellation calculation case.

## WORK-STATE RULE — REQUIRED

Every meaningful task must have exactly one state so interrupted work is never lost:
- **ACTIVE** — the one task being worked on now.
- **INTERRUPTED** — original task paused because a blocking incident appeared; always record the exact return point.
- **INCIDENT** — branched investigation needed to protect data or core behavior.
- **NEEDS TEST** — implementation exists but evidence is not yet sufficient.
- **PHONE PASS / PHONE FAIL / AUTOMATED PASS / STATIC PASS / BLOCKED** — evidence status.
- **CLOSED** — completed/verified work; move detailed history to `PROGRESS.md` and retain only the return pointer here.
- **BACKLOG** — future work; keep in `ROADMAP.md`, not here.

When an INCIDENT closes, return to the most recent INTERRUPTED task unless the user explicitly changes priority.

## START HERE — EVERY NEW CHAT

1. Read this file first from `development-modular`.
2. Go directly to the `ACTIVE BRANCH` named above.
3. Read that branch's `docs/MONGO_AGENT_WORKBOOK.md`.
4. Read the latest relevant section at the bottom of `docs/modularization/PROGRESS.md` and `ROADMAP.md`.
5. Inspect the ACTIVE BRANCH head and the latest relevant commits.
6. Identify the latest `PHONE PASS`, `PHONE FAIL`, `NEEDS TEST`, or other explicit evidence.
7. Continue from the exact `ACTIVE`/return checkpoint above. Do not restart from `main`, an older milestone, or a closed incident.

## POINTER UPDATE RULE — REQUIRED

Whenever active development moves to another feature/integration branch, update this file on `development-modular` immediately so `ACTIVE BRANCH`, current area/task, latest known checkpoint, status, and next step point to the new work.

Whenever a meaningful phone test changes the current state, update the active branch journal first; then update this pointer if the current task/status/next step changed materially.

If a blocking incident interrupts the active task, record BOTH the interrupted task and the incident. Never replace the original task with the incident without an explicit return point.

`CURRENT_WORK.md` is the navigation pointer only:
- Full attempted/completed history → active branch `docs/modularization/PROGRESS.md`
- Future/next work → active branch `docs/modularization/ROADMAP.md`
- Agent rules and protected behavior → active branch `docs/MONGO_AGENT_WORKBOOK.md`

## SAFETY

- This pointer does **not** promote the feature branch to verified baseline.
- Do not modify `main` merely because this file points to a feature branch.
- Do not overwrite the verified V44.12.30 lineage without user-approved verification.
- One ACTIVE development task at a time unless the user explicitly chooses otherwise.
- Preserve proven Backup/Delete/Restore protections unless new regression evidence requires a scoped investigation.

---
Updated: 2026-09-13
