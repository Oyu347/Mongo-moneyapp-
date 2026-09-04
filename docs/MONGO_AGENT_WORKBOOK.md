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
2. Confirm working branch is `development-modular`.
3. Read this workbook.
4. Inspect the latest relevant commits and compare them with the verified lineage.
5. Identify exactly one requested task/fix.
6. Determine which files/functions are affected before editing.
7. Preserve all unrelated working behavior.
8. Make the smallest safe change.
9. Run available tests/checks.
10. Report what changed, what was tested, and what still needs user testing.

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
5. The workbook is updated with the result when the change becomes a new verified state.

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

---

Last initialized: 2026-09-04
Status: ACTIVE — initial agent control workbook created.
