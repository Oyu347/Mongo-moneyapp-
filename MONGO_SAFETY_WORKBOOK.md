# Möngö Agent — DATA SAFETY WORKBOOK
Updated: 2026-10-28
Canonical branch: feature/completed-cards-archive
Companion: MONGO_CURRENT_WORK.md

## Evidence classification (use for every item)
- PROPOSED: idea only
- ISOLATED_TEST_PASS: synthetic/unit test passed, not integrated
- CODE_REVIEWED: source inspected, no runtime guarantee
- INTEGRATED_UNVERIFIED: in app branch, no end-to-end test
- INTEGRATION_TEST_PASS: exact branch revision tested against emulator/test accounts
- PRODUCTION_VERIFIED: specifically approved release with measured post-deploy verification
- BLOCKED/FAILED: failing or insufficient evidence
Never use 'completed' without test environment and revision.

## Historical facts to retain
1. Owner reported TWO unexpected user-data-loss incidents. Exact root causes are not proven. In one investigation data appeared empty/partially restored; later four older transactions were present while four newest were missing.
2. Asset-transfer deletion bug: deleting a ₮250,000 transfer did not restore source account as expected; deleting transfers vs asset cards must not silently break linked records.
3. Previous Termux/Firebase/cloud diagnostics, 9/9 and other synthetic checks were performed; prior workbook MONGO_WORKBOOK_DATA_INTEGRITY_2026-10-17.md includes V153–V183 notes. Historical pass is not integration proof.
4. Historic audit suspected local/cloud overwrite paths involving applyFinancialState, mongo_v4_<uid>, mongo_sync_queue_<uid>, mongo_cloud_snapshot_<uid>, snapshot and enqueueSave. Treat as risks to verify, not confirmed incident cause.
5. PATCH01–PATCH14 were worked on as separate report/proposal/test-style artifacts. Some patches have HTML test-only variants and duplicated test filenames; do not assume all exactly three files or all present without inventory.
6. PATCH14: MONGO-INDEX4-PATCH14-REAL-SCHEMA-REPORT.md, MONGO-PATCH14-REAL-SCHEMA-SALE-PROPOSAL.cjs, MONGO-PATCH14-REAL-SCHEMA-SALE.test.cjs. Report says 10/10 isolated Node PASS. It was NOT integrated.
7. PATCH14 ledger example: opening ₮1,000,000 + sale proceeds ₮6,000,000 = bank ₮7,000,000; ₮1,000,000 gain tracked separately with skipAccountBalance:true. Needs actual branch integration checks.
8. PATCH15 proposed review: real MongoAssets.groupKey vs proposal assetGroupKey, legacy lots, saveAssetSale, realized gain, budgets, failure rollback, cloud persistence, delete/sale lifecycle.
9. The uploaded index (4).html was used for prototype work, but branch index.html byte equivalence is NOT established. GitHub fetch_file returned empty content despite existing blob SHA; investigate with another read method before claiming full comparison.
10. No application code merged and no Firebase/production data modified in 2026-10-28 handoff session.

## Audit matrix to complete
| Work | Evidence | Current status | Next verification |
|---|---|---|---|
| Termux earlier sessions | Prior workbook, chat/screenshots, test files | HISTORICAL, inventory pending | Map exact versions, commands, outcomes |
| PATCH01–PATCH13 | Library reports/proposals/tests | NOT YET RECONCILED | Inventory each, run on same baseline |
| PATCH14 | Report, proposal, Node test | ISOLATED_TEST_PASS (historic 10/10) | Rerun, groupKey/legacy, browser+emulator |
| PATCH15 | Audit plan and preliminary code comparison | CODE_REVIEWED PARTIAL | Trace real branch sale + budgets |
| Local/cloud data protection | Prior integrity workbook | HIGH RISK, NOT VERIFIED | Read/write path map + fail-closed tests |
| Recovery/backup | Historic restore and delete-all-data issues | NOT VERIFIED | Restore drill with synthetic data |
| Firestore UID isolation | Security principle only here | NOT VERIFIED | Rules/emulator multi-user tests |
| Millions-of-users scale | Goal | NOT TESTED | Load, quota, cost and architecture review |

## Data-safety acceptance scenarios
- Cold start with valid local data and empty/partial cloud: no destructive overwrite.
- Valid cloud data and incomplete local cache: no destructive overwrite.
- Offline create/update/delete, app restart, reconnect and retry: no lost or duplicate records.
- Concurrent writes from two devices: deterministic conflict detection and safe resolution.
- Failed local write, failed cloud write, interrupted process: recoverable consistent state.
- Delete asset-linked transfer: bank and asset ledger reconcile; no double reversal.
- Sell multiple lots: proceeds once, profit separately, correct archive, budget month, no double count.
- Restore/backup and delete-all-data: complete, intentional, auditable, recoverable per policy.
- UID A cannot read/write UID B.
- Schema migration from older versions preserves every record and identifiers.

## Worklog (append-only summaries)
2026-10-28 — Correct branch identified; GitHub index.html blob found but contents unavailable via fetch_file. PATCH14 historical 10/10 report read; proposal/test read. Uploaded index (4).html groupKey mismatch risk identified. Owner prioritizes full safety baseline before PATCH15. Created persistent GitHub handoff docs; NO APP CODE OR USER DATA CHANGE.

## Every future work session must append
Date/time; branch+commit SHA; exact files changed; tested scenarios and command/environment; pass/fail; user-confirmed result; residual risks; next single action. Never overwrite earlier verified facts with unsupported assumptions.
