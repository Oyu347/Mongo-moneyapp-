# Möngö Agent — CURRENT WORK (single entry point)
Updated: 2026-10-28
Repository: Oyu347/Mongo-moneyapp-
CANONICAL WORKING BRANCH: feature/completed-cards-archive
Status: SAFETY BASELINE / AUDIT FIRST — no production integration approved.

## Read this first in every new chat
1. Open this file from the canonical branch.
2. Read MONGO_SAFETY_WORKBOOK.md from the same branch.
3. Verify current branch and commit before any code changes; do not assume main/Development/development-modular is the baseline.
4. Find original PATCH01–PATCH14 report/proposal/test artifacts in ChatGPT Library/Project files; do not infer that passing isolated tests means integration.
5. Read existing prior integrity workbook MONGO_WORKBOOK_DATA_INTEGRITY_2026-10-17.md when available.
6. Report exact last completed step, evidence, risks, and one next action. Update these two documents after verified work.

## Primary objective
Prevent data loss, cross-user exposure, incorrect balances, silent overwrite, and unrecoverable corruption. Two unexpected data-loss incidents were reported. Scale to millions only after integrity and security are proven.

## Current verified facts
- Correct branch named by owner: feature/completed-cards-archive.
- GitHub branch exists and index.html exists (blob SHA observed 3770e27523c71745d53c33e68bd813bd3d36398c). GitHub fetch_file returned empty content in 2026-10-28 session; DO NOT claim branch index contents audited.
- A separate uploaded file index (4).html is available in prior conversation/Library and was used for PATCH14 prototype; do not assume byte-identical to current GitHub branch.
- PATCH14 report states 10/10 isolated Node tests passed historically, NOT browser/Firebase/production validation.
- PATCH14 proposal was NOT integrated into main app; PATCH15 is NOT complete.
- PATCH14 uses assetGroupKey matching; MongoAssets.groupKey in uploaded index (4).html derives typeKey + normalized name. Legacy lot compatibility is unproven.
- Existing saveAssetSale path was reported to mutate in-memory arrays before saveData; rollback and persistence need verification.
- Historical integrity workbook flags applyFinancialState/local-cloud overwrite, queue and snapshot concerns; suspected mechanism, NOT established root cause of the two incidents.
- No GitHub application code, Firebase, production or real user records changed during current audit.

## Immediate priority (DO NOT jump directly to PATCH15 integration)
1. Freeze and identify precise branch baseline SHA, file inventory, schema and restore point.
2. Reconcile Termux tests and PATCH01–PATCH14 report/proposal/test files, including duplicates/missing variants, with evidence statuses.
3. Trace all read/write paths: local state, cloud state, applyFinancialState, saveData, snapshots, sync queue, delete/restore, offline/concurrent devices.
4. Reproduce both reported loss scenarios using synthetic test users and emulator; preserve real user data.
5. Design fail-closed load/write guards, revision/version checks, idempotency, backups, recovery and atomic persistence; verify with integration tests.
6. Reconcile ledger invariants across transfers, savings, loans, investment purchase/sale, deletion/rollback, monthly budgets.
7. Only then integrate small reviewed patches with regression gates; continue PATCH15 and later load/security testing.

## Non-negotiable release gates
- Never overwrite a known-good local/cloud snapshot with empty/partial/unverified state.
- Never declare save successful without appropriate persistence acknowledgment; distinguish local vs cloud durability.
- Never test destructive paths on live user accounts.
- Preserve an independently restorable backup and verify restore.
- Verify Firestore per-UID isolation and rules with emulator tests.
- Test offline, retries, duplicate events, two-device conflicts, migrations and rollback.
- Document test environment, exact code version, commands, pass/fail and remaining limitations.
- Do not deploy or modify production without explicit authorization.

## Next action
Build a source-of-truth audit matrix for PATCH01–PATCH14 + Termux sessions, then map actual branch code paths; do not claim completion before evidence.


## 2026-10-28 — V16 resume pointer (documentation only)
- **NEXT READ:** [MONGO_V16_INTEGRATION_READINESS.md](MONGO_V16_INTEGRATION_READINESS.md).
- Uploaded canonical history: `TERMUX-ISOLATED-TEST-JOURNAL-V15.md` and `TERMUX-V15-V295-V516-MASTER-REGISTER.csv` (222 rows, V295–V516); original uploads are in the conversation, not automatically committed to this repo.
- Other evidence: [MONGO_PATCH_AUDIT_MATRIX.md](MONGO_PATCH_AUDIT_MATRIX.md), [MONGO_CLOUD_LOCAL_AUDIT_01.md](MONGO_CLOUD_LOCAL_AUDIT_01.md), [MONGO_V511_V513_ARCHIVE_VERIFICATION.md](MONGO_V511_V513_ARCHIVE_VERIFICATION.md).
- **CURRENT TASK:** read-only verification of V295 save/mutation path and V359/V360 Firebase rules against exact current branch commit; resolve full index.html retrieval before production-code claims.
- **NO INTEGRATION:** no application code, Firebase rules, live data or deployments changed. V15/Termux/PATCH PASS reports are isolated/historical until independently reproduced and integrated.
