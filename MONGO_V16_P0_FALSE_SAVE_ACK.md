# Möngö V16 — P0 false local-save success confirmed
Date: 2026-10-28
Status: VERIFIED STATIC CODE PATH; NO runtime failure injection or deployment.
Source: index.html Git blob 3770e27523c71745d53c33e68bd813bd3d36398c

## Verified end-to-end chain
1. Inline storage module `src/services/storage/storage.js`: `set(key,value)` wraps `nativeStorage.setItem`, returns `true` on success, catches and returns `false` on failure. `setJSON(key,value)` returns `set(key,JSON.stringify(value))` and returns `false` on stringify error.
2. Main `saveData()` calls `window.MongoStorage.setJSON(getDBKey(),data);` and then unconditionally calls `showSaveIndicator();`. It ignores `false` and returns no explicit boolean.
3. `showSaveIndicator()` lights up `#save-dot` for 1400ms, which can mislead the user about local persistence.
4. Cloud wrapper: `const originalSaveData=...`; `window.saveData=function(){ if(!applyingCloud) markLocalUpdated(); const res=originalSaveData.apply(this,arguments); scheduleCloudSave('saveData'); return res; }`. Cloud sync is scheduled irrespective of local persistence result. This does not by itself prove cloud write success or data loss.
5. `fingerprint(data)` returns `JSON.stringify(data).slice(0,1200000)`, creating potential collisions for distinct states sharing a long common prefix; not yet reproduced.

## Confirmed defect and limitations
CONFIRMED: False-positive local save UI is possible when storage returns false. Cloud scheduling is not gated on durable local save. Root cause of historic loss incidents is UNKNOWN.
CONFIRMED: The storage module itself correctly reports false; caller fails to honor the contract.
NOT VERIFIED: whether the user's live device has hit quota; cloud behavior under the fault; deployment version equality; any actual financial record loss.

## Proposed isolated acceptance tests
T1. Mock localStorage.setItem throwing QuotaExceededError. Assert MongoStorage.setJSON returns false and saveData never shows success.
T2. Simulate failed local save and assert Cloud scheduling follows explicit policy (e.g. fail-closed, or durable alternate journal), never silent.
T3. Successful local save shows indicator exactly once and schedules Cloud normally.
T4. JSON.stringify failure returns false and blocks success UI.
T5. Distinct >1.2m-char states with same prefix must not deduplicate.
T6. Restore path `MongoStorage.setJSON` calls must check false before reload/cloud restore; test failure injection.
T7. No regressions to V152 preflight, clear/restore, account UID and offline queue.

## Safe correction sketch (NOT APPLIED)
- Make `saveData()` return boolean from MongoStorage.setJSON and only call showSaveIndicator on true.
- Have wrapper inspect result and explicitly surface failure, with durable fallback policy before any cloud sync.
- Audit all direct setJSON callers, especially importData restore, before patching.
- Create isolated tests first and only then a reviewed app patch. Preserve exact original blob.

NO APP CODE MODIFIED. NO FIREBASE OR PRODUCTION ACTION.
