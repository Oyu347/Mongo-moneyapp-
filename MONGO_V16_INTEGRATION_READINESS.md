# Möngö — V16 Integration Readiness / Evidence Crosswalk
Date: 2026-10-28
Status: DOCUMENTATION ONLY; NO APP INTEGRATION OR TEST RE-RUN.

## Source of truth
User-supplied TERMUX-ISOLATED-TEST-JOURNAL-V15.md (859 lines) and TERMUX-V15-V295-V516-MASTER-REGISTER.csv (222 version rows, V295–V516). Keep BOTH originals unchanged; V15 is the current master, V1–V14 and ZIP/logs remain historical evidence.

## V15 categories (NOT independent PASS counts)
- 179: source audited, execution not verified
- 13: historical PASS reports, not re-run
- 1: partial/conflicting historical report
- 1: historical HTTP outcome report
- 28: missing evidence
Total 222. Historical claims are not production certification.

## Critical unresolved risks
P0 1. V295: mutation before save, local/cloud snapshot and fingerprint handling, non-atomic five mirror writes; confirm against actual branch source.
P0 2. V359 owner-write rules unsafe. V360 server-only design is isolated; production authenticated endpoint/rules not established.
P0 3. V377–V429: 49 source files flagged for possible check(...,true) false-positive assertions; inspect actual assertions.
P0 4. V430–V499: multiple original/fixed archives; expected assertion counts are not execution logs.
P0 5. V500–V516: V510 9/9 stored result/hash, V511/V513 byte-integrity evidence; V509/V512/V513 standalone evidence incomplete. V516 is integration REVIEW, not merged code.
P1 6. V296–V320: 25 versions without source/log evidence in available audit.
P1 7. PATCH01–PATCH15 isolated proposals/audits; PATCH14 real-group-key mismatch and sale rollback remain unmerged.

## Integration gates (must all be evidenced)
1. Freeze canonical branch+commit SHA and capture byte-identical full app source, rules, cloud functions and deploy target.
2. Back up staging data and establish tested rollback/restore; never test on live customer data.
3. Inventory all financial write paths; enforce durable save acknowledgment, failure-atomic state, per-UID isolation, idempotent operation IDs and canonical revision/CAS.
4. Test offline/online, 41+ queue operations, corrupt snapshots, interrupted write, multiple devices, lost ACK, restore and deletion quarantine in emulator/staging.
5. Replace false-positive asserts; archive command, environment, exit code, output, test source SHA256.
6. Only then create a minimal integration branch; review, deploy to staging, run full regression, approve production separately.

## Immediate next action
Read-only compare V295/V359/V360 against **current branch** source and Firebase rules. Do not assume previously uploaded index (4).html equals branch index.html. If source fetch is empty, resolve retrieval before claiming current-code findings.

## Resume instructions
1. Read MONGO_CURRENT_WORK.md (short pointer).
2. Read this V16 crosswalk and MONGO_CLOUD_LOCAL_AUDIT_01.md.
3. Consult uploaded V15 journal+CSV for specific versions, then original ZIP/log as needed.
4. Record all changes with evidence, separate VERIFIED / HISTORICAL REPORT / SOURCE ONLY / UNKNOWN / INTEGRATED.


## 2026-10-28 — Source identity and Termux history reconciliation
- GitHub index.html blob SHA: `3770e27523c71745d53c33e68bd813bd3d36398c`. A direct blob read returned full text (1,853,524 JS string characters); prior empty fetch_file content was a retrieval limitation, not missing source.
- Earlier comparison identified uploaded `index (4).html` with the same Git blob SHA; this establishes byte identity for the compared artifact at that revision. Recheck SHA against branch HEAD before later edits.
- Recovered `Mongo-CURRENT-WORK.md` (2026-10-21) and `Mongo-Termux-Inventory.txt` (2026-10-27) from Library: V358–V362 84/84 historical static checks; V364–V367 emulator screenshots and V365 4/4, V366 8/8, V367 6/6 historical; V368 was pending at the 2026-10-21 checkpoint, but later inventory includes tests through V510. Do NOT treat V368 as current pending work without consulting V15 master.
- V15 master journal + CSV: 222 versions V295–V516, categories 179 source-only, 13 historical PASS, 1 partial/conflicting, 1 HTTP outcome, 28 missing evidence. V516 is integration review, NOT merged app code.
- Highest-priority next action: verify actual branch index source paths and V295 save/overwrite mechanisms against V15, then verify V359/V360 rules and backend integration evidence. No production changes or tests re-run in this documentation update.
