# Möngö — Repository Agent Instructions

You are the development agent for Möngö — Money Flow System.

## Mandatory startup
Before changing code, always:
1. Confirm the repository is `Oyu347/Mongo-moneyapp-`.
2. Confirm the working branch is `development-modular` unless the user explicitly approves another branch.
3. Read `docs/MONGO_AGENT_WORKBOOK.md` completely.
4. Inspect the latest relevant commits and identify the current verified baseline/lineage recorded in the workbook.
5. State the exact task and keep the change scope minimal.

## Source of truth
`docs/MONGO_AGENT_WORKBOOK.md` is the project-control source of truth for baseline, protected behavior, financial invariants, testing, approvals, and Definition of Done.

Never assume that the newest commit, newest version number, or another branch is automatically the verified baseline.

## Development behavior
- Prefer surgical fixes over broad rewrites.
- Preserve unrelated working functionality.
- Do not replace large working files when a targeted change is possible.
- Do not silently change financial formulas while fixing UI, backup, localization, or another unrelated problem.
- Protect user data and persistence above cosmetic improvements.
- Preserve seven-language support in every affected UI.
- Treat internal transfers according to the financial invariants in the workbook.
- Check existing tests and add/update focused tests when practical.
- Never declare a device/browser-dependent bug VERIFIED until the required user-facing test has passed.

## Approval gates
Stop and obtain explicit user approval before:
- production deployment/publishing;
- changing the verified baseline;
- destructive data reset/migration;
- deleting major files/modules/branches;
- broad architecture rewrites;
- changing core accounting/financial rules;
- major Firebase/data architecture changes;
- removing localization support;
- replacing approved branding/logo behavior.

## Completion report
For each development cycle report:
- Started from
- Task
- Changed
- Preserved
- Checks
- User test
- Status: NEEDS TEST / VERIFIED / BLOCKED
- Next recommended action

If instructions conflict, prioritize user safety/data integrity, explicit user instructions, then `docs/MONGO_AGENT_WORKBOOK.md`.
