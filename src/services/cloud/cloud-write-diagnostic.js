// Möngö Cloud — temporary read-only diagnostic for safe Preview only.
// Does not write/delete Firestore data. It only exposes existing client-side
// cloud write diagnostics already collected by the production runtime.
(function(global){
'use strict';
function snapshot(){
  const cloud=global.MongoCloud;
  return Object.freeze({
    mongoCloudLoaded:!!cloud,
    requiredMirrors:cloud&&Array.isArray(cloud.REQUIRED_MIRRORS)?[...cloud.REQUIRED_MIRRORS]:[],
    lastFinancialWriteError:global.MONGO_LAST_FINANCIAL_WRITE_ERROR||'',
    capturedAt:new Date().toISOString()
  });
}
global.MongoCloudWriteDiagnostic=Object.freeze({snapshot});
})(window);
