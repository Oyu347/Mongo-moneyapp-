# Möngö — PATCH01–PATCH15 Evidence Inventory
Updated: 2026-10-28
Branch: feature/completed-cards-archive
Status: DOCUMENTARY AUDIT ONLY. No source integration or Firebase validation.

## Library inventory
Library listing surfaced **43 named PATCH01–PATCH14 artifacts**: 14 Markdown reports plus test-only HTML, JS proposals/tests and duplicate test copies. Names and counts are inventory evidence, not proof of test success. Each report was read in this audit.

| Patch | Purpose | Historic report result | Classification |
|---|---|---|---|
| PATCH01 | Local save result | 3/3 isolated | TEST ONLY |
| PATCH02 | Staged transaction guard | 5/5 isolated | PROPOSAL |
| PATCH03 | Actual transfer delete | 4/4 isolated | DIAGNOSTIC |
| PATCH04 | Asset-transfer root cause | isolated source checks | DIAGNOSTIC |
| PATCH05 | Atomic linked delete | 6/6 isolated | PROPOSAL |
| PATCH06 | Embedded ledger | 7/7 isolated | DIAGNOSTIC |
| PATCH07 | Asset delete integration | 6/6 isolated | TEST ONLY |
| PATCH08 | Asset purchase delete guard | 4/4 isolated | TEST ONLY |
| PATCH09 | Purchase/sale/archive lifecycle | 6/6 isolated | DIAGNOSTIC |
| PATCH10 | Sold asset guard | 7/7 isolated | TEST ONLY |
| PATCH11 | Sale failure rollback | 4/4 diagnostic | DEFECT IDENTIFIED |
| PATCH12 | Sale transaction proposal | 8/8 isolated | PROPOSAL |
| PATCH13 | Real ledger/budget schema | 7/7 diagnostic (initial FAIL) | SCHEMA MISMATCH |
| PATCH14 | Real schema sale proposal | 10/10 isolated | PROPOSAL / NOT MERGED |

### Additional PATCH15 reports found
- MONGO-INDEX4-PATCH15-GROUPKEY-AUDIT.md — 6/6 diagnostic assertions historically; legacy groupKey mismatch risk.
- MONGO-INDEX4-PATCH15-GROUP-SALE-BUDGET-AUDIT.md — 7/7 expected diagnostic assertions historically; includes checks that detect risks.
- MONGO-INDEX4-PATCH15-GROUP-SALE-AUDIT.md — 8/8 diagnostic assertions historically; explicitly includes defect detection.
**PATCH15 is already partially researched, NOT implemented/merged.**

## High-priority findings
1. PATCH14 selects lots by `assetGroupKey`; actual `MongoAssets.groupKey` derives type/name. Ordinary legacy lots can be omitted; PATCH15 source audits confirm mismatch. Do not merge PATCH14 unchanged.
2. PATCH13 documented initial FAIL: PATCH12 gain transaction lacked `assetIncome:true`, and budget category model did not match real app. Later diagnostic 7/7 is NOT a successful production acceptance test.
3. PATCH11 documents missing sale failure rollback in tested PATCH10; persistence and cloud acknowledgment are separate.
4. PATCH01–PATCH10 isolated passes cannot establish live data safety.
5. Data-loss incident root causes remain unproven. Earlier integrity workbook flags local/cloud overwrite and queue/snapshot handling. Prioritize this before sale integration.

## Evidence status / limitations
- Report numbers are **historical claims read from source reports**, not freshly executed tests.
- Test-only HTML copies are NOT production artifacts.
- The GitHub branch index.html blob was located, but content was returned empty by fetch_file; uploaded index (4).html was used in earlier analyses. Byte equality not established.
- No full end-to-end Firebase emulator, two-device, restore or security-rules evidence was established by this inventory.
- There may be additional Termux artifacts beyond the 43 files. Historical V153–V183 notes need systematic reconciliation.
- No production or application-code changes authorized.

## Next prioritized task
**Read/write-path audit** on actual branch code, especially `applyFinancialState`, `saveData`, `enqueueSave`, local snapshot, Firestore writes, offline and restore. Capture exact branch revision and full file content via a verified read mechanism. Build synthetic reproductions for local/cloud partial-state overwrite before changing code.

## How to resume
Open MONGO_CURRENT_WORK.md, MONGO_SAFETY_WORKBOOK.md, then this file. Continue from the most recent evidence; append verified changes to the worklog, never overwrite historical facts.
