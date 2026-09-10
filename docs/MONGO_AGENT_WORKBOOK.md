# Möngö Development Agent — Ажлын дэвтэр

> Энэ файл нь Möngö — Money Flow System хөгжүүлэлтийн agent-ийн үндсэн ажлын хяналтын баримт бичиг.
> Код өөрчлөхөөс өмнө заавал уншина.

## 1. Source of Truth

- Repository: `Oyu347/Mongo-moneyapp-`
- Working branch: `development-modular`
- Current verified lineage: `V44.12.30`
- Verified baseline commit: `7ea64684074f6f5f33ee3b65d4abddcc70bbc53d` — Restore verified V44.12.30 working Vercel baseline
- Complete runtime restore: `e98e6e2732ca5d69b1d52137b0f6e7b6d5e15601`
- Latest targeted backup fix: `b73411505f72413907108d053e85db38f35c448f` — Fix only V44.12.30 mobile backup download

### Baseline rule
Never silently replace this baseline with V44.12.40, V44.12.5, an older upload, another branch, or an unverified file. A newer commit is not automatically a new verified baseline. The baseline changes only after user-approved testing confirms it.

## 2. Agent startup protocol

Before every development task:

1. Confirm repository is `Oyu347/Mongo-moneyapp-`.
2. Confirm working branch is `development-modular` or the explicitly approved isolated feature/integration branch for the current task.
3. Read this workbook.
4. Read `docs/modularization/PROGRESS.md`, `ROADMAP.md`, `RULES.md`, and `ARCHITECTURE.md` when relevant.
5. Inspect the latest relevant commits and compare them with the verified lineage.
6. Identify exactly one requested task/fix.
7. Determine which files/functions are affected before editing.
8. Preserve all unrelated working behavior.
9. Make the smallest safe change.
10. Run available tests/checks.
11. Record the result in the correct project journal before moving to the next development cycle.
12. Report what changed, what was tested, and what still needs user testing.

If repository, branch, baseline, or requested scope is ambiguous: STOP and ask before modifying code.

## 3. Current protected behavior

Do not regress these areas while fixing another issue:

- Existing user data must persist across refresh/login as designed.
- Seven-language UI/localization must remain intact.
- Money Accounts / Cash / Bank / Savings account logic must remain intact.
- Internal transfers must not become income or expense.
- Savings funding and linked-goal behavior must remain intact.
- Loan and investment transfer logic must remain intact.
- Budget integrations must not be silently changed by unrelated fixes.
- Currency display must follow selected currency/locale rather than hard-coded ₮ where dynamic currency is expected.
- Existing branding/logo behavior must not be replaced by an older or incorrect version.
- Backup/download changes must not reset or delete live app data.

## 4. Current focus

### Recently handled
- Restored verified V44.12.30 Vercel baseline.
- Restored complete V44.12.30 runtime modules.
- Applied a targeted mobile backup-download fix.

### Immediate verification
The latest backup fix must be regression-tested. Confirm at minimum:

- Backup action responds visibly.
- Download/file creation completes on mobile where supported.
- Existing app data remains present after backup attempt.
- Refresh/re-login does not lose existing data.
- No unrelated UI/functionality changed.

Do not mark the backup issue DONE solely because code was committed. User test result is required.

## 5. Launch-critical priority order

When choosing the next task, prefer:

1. Data integrity / persistence / backup / restore
2. Financial calculation correctness
3. Login/authentication and access
4. Seven-language consistency
5. Core Money Accounts / Transfer / Budget / Savings / Loan / Investment flows
6. Mobile usability and regression bugs
7. Launch/paywall/payment readiness
8. Cosmetic improvements
9. Future ideas

Future ideas must not expand launch scope unless the user explicitly promotes them.

## 6. Financial invariants

These are safety rules, not cosmetic preferences:

- Bank → Cash withdrawal = internal Transfer, not Expense.
- Cash → Bank deposit = internal Transfer, not Income.
- Normal account-to-account transfer must not change total money, income, expense, cash flow totals, or net worth merely because money moved location.
- Actual purchase paid from Cash = Expense from Cash.
- Savings funding is handled through Transfer rather than duplicating it as Expense.
- Avoid double-counting loan/savings/investment flows in Budget or transaction totals.
- Do not change financial formulas as part of an unrelated UI/backup fix.

## 7. Change-scope rule

For every fix, define:

- Problem
- Expected behavior
- Files/functions to change
- Files/functions explicitly NOT to change
- Test cases
- Rollback point

Prefer a surgical patch over replacing large working files.

## 8. Actions requiring user approval

STOP before doing any of the following unless the user explicitly approves:

- Change the verified baseline/source-of-truth version.
- Deploy/publish to production.
- Delete or reset user data.
- Delete major files/modules/branches.
- Perform a broad rewrite/refactor unrelated to the requested fix.
- Change core financial accounting rules/formulas.
- Change Firebase/data architecture or destructive migrations.
- Remove supported languages or replace the localization architecture.
- Replace the approved brand/logo system.
- Merge experimental work into the protected working lineage without testing.

## 9. Testing checklist

After a meaningful code change, check relevant items:

- App opens successfully.
- Login/logout/re-login works if affected.
- Existing data remains available.
- Changed feature works for the reported scenario.
- Save/edit/delete behavior works where applicable.
- Refresh does not undo valid data.
- Currency/number formatting is correct.
- Seven languages have no obvious missing/hard-coded strings in affected UI.
- Transfers do not create false income/expense.
- Budget/savings/loan/investment totals remain consistent if affected.
- Mobile layout/taps work for affected UI.
- No obvious console/runtime error from the change.

## 10. Definition of Done

A task is DONE only when:

1. The requested behavior is implemented.
2. Relevant regression checks pass.
3. Existing protected behavior remains intact.
4. User-facing test is completed when device/browser behavior is involved.
5. The workbook and/or project journals are updated with the result when the change becomes a new verified state or yields an important diagnostic result.

Commit ≠ verified. Deploy ≠ verified. User-tested working state = candidate for verified baseline.

## 11. Agent report format

At the end of each development cycle report briefly:

- **Started from:** branch + baseline/commit
- **Task:** what was fixed
- **Changed:** files/functions
- **Preserved:** important areas intentionally untouched
- **Checks:** tests performed and result
- **User test:** exact steps the user should try
- **Status:** NEEDS TEST / VERIFIED / BLOCKED
- **Next:** one recommended next action

## 12. Project Manager handoff

The future Möngö Project Manager Agent should use this workbook to prioritize work. It may recommend the next task but must not silently redefine the verified baseline or override the safety/approval rules above.

## 13. Development journal discipline — REQUIRED

This project must keep its development memory in GitHub, not only in chat history. Before starting a new development cycle and again after obtaining a meaningful result, update the appropriate document.

### Where each kind of information belongs
- `docs/modularization/PROGRESS.md` — work actually attempted or completed: exact branch/commit when known, PHONE PASS/FAIL, automated checks, failed approaches, regressions, discovered root causes, rollback points, and unresolved risks. A failed attempt must remain recorded so it is not repeated later.
- `docs/modularization/ROADMAP.md` — next work and future work that is not yet verified/implemented. Do not mark roadmap ideas as completed merely because they were discussed or prototyped.
- `docs/modularization/ARCHITECTURE.md` — stable system boundaries and structural decisions only.
- `docs/modularization/RULES.md` — permanent safety rules and financial invariants that future changes must preserve.
- `docs/MONGO_AGENT_WORKBOOK.md` — source-of-truth control, verified lineage, active branch rules, startup/handoff protocol, and cross-document journal rules.

### Mandatory status labels
Use explicit evidence labels in development notes:
- `PHONE PASS` — user confirmed the exact behavior on the phone/device.
- `PHONE FAIL` — user tested and the requested behavior did not work.
- `AUTOMATED PASS` — the named automated test/workflow passed; this does not imply phone verification.
- `STATIC PASS` — syntax/static checks only.
- `NEEDS TEST` — implemented/prepared but not yet user-verified.
- `BLOCKED` — cannot safely proceed until the stated dependency is resolved.

Never convert `PHONE FAIL`, `NEEDS TEST`, or an automated-only result into `VERIFIED`/`PHONE PASS` without actual evidence. Do not erase failed approaches after a later fix; retain a concise note explaining why they failed.

### Continuity gate before the next code change
Before editing code, answer from the repository notes:
1. What is the last verified working point for this behavior?
2. What was the last attempted change and its result?
3. What root cause is proven versus still a hypothesis?
4. Which protected behavior must not regress?
5. Which document will receive this cycle's result?

If these cannot be answered from GitHub notes, update the notes first. This gate is intended to prevent loss of context across chats, devices, or future agents.

### Current isolated feature-work reminder — 2026-09-10
Completed-card/archive and Savings ↔ Budget work is being tested on `feature/completed-cards-archive`; it is not a replacement for the verified V44.12.30 baseline and must not be promoted to `development-modular` or `main` without the normal testing and user approval gates.

For this feature work specifically, preserve the already working savings-goal deletion undo contract while diagnosing Budget actuals: deleting a goal must undo its linked savings transfers as designed, restore the source-account effect, detach rather than delete the savings account, remove only the exact goal-linked Budget subcategory/value, and must not create income/expense or change total money merely because of the undo.

---

Last initialized: 2026-09-04
Journal discipline strengthened: 2026-09-10
Status: ACTIVE — agent control workbook and GitHub journal continuity required.
