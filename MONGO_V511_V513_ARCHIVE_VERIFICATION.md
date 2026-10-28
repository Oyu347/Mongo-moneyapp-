# Möngö — V511/V513 Evidence Archive Verification
Date: 2026-10-28
Scope: user-supplied artifacts, read-only verification. NO production/Firebase/app changes.

## Uploaded artifacts
- V511-evidence-archive.zip: 3,175 bytes
- V513-archive.sha256: standalone checksum manifest
- Computed SHA256 of ZIP: eeec28593c32506e3bb026991183debf1b8875933d2666cc5d4c404b7e3a2964
- V513 listed digest: eeec28593c32506e3bb026991183debf1b8875933d2666cc5d4c404b7e3a2964
- Result: MATCH.
- ZIP CRC integrity test: PASS.
- 5 ZIP entries, no extraction necessary:
  1. V502-evidence-seal.json
  2. V503-independent-anchor.json
  3. V505-audit-report.json
  4. V507-verification-receipt.json
  5. V510-source-hashes.sha256
- All four hashes in V510-source-hashes.sha256 were independently recomputed from ZIP entry bytes: 4/4 MATCH.

## Contents and evidence limits
- V502 seal lists four original V500 files: evidence.json (12,641 bytes) and round-1.log/round-2.log/round-3.log (8,296 bytes each), with their SHA256 hashes. **These four original source files are NOT inside V511 ZIP.** Their existence/contents cannot be independently checked from this ZIP.
- V503 anchor records SHA256 of V502 seal.
- V505 report: scope ISOLATED READ-ONLY EVIDENCE; NO PRODUCTION PATCH; status VERIFIED_AT_REPORT_TIME. Records v504 PASS re-executed, 3 V500 rounds, four source files. Prior user-observed V500 3/3, V501 15/15, V502 8/8, V503 8/8, V504 10/10. Prior V501–V503 are user-observed screenshots, not independently rerun in V505.
- V507 receipt: scope ISOLATED MANIFEST VERIFICATION ONLY; NO PRODUCTION PATCH; status PASS; does not re-read four original V500 files.
- SHA256 matching demonstrates byte consistency relative to supplied manifest, NOT independently trusted origin, digital signature, external timestamp or Firebase production reliability.
- V513 manifest was supplied with ZIP; it is not by itself an independent trusted anchor. For independent provenance assurance, preserve an externally trusted hash or signed attestation.
- No app integration proven.

## Current decision
Treat V511/V513 as VERIFIED ARCHIVE BYTE INTEGRITY, not PRODUCTION SAFETY PASS. Keep originals unchanged. Add to Termux inventory, then obtain original V500 evidence.json/three round logs and V368–V510 worklog to map test coverage to production read/write paths.

## Next action
Read GitHub branch current app source through verified method; build complete local/cloud write-path map and compare against Termux evidence and PATCH01–PATCH15.
