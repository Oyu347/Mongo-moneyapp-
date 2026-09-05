// Möngö Delete All Data runtime bridge — isolated integration layer.
// Keeps the verified V44.12.30 UI untouched while routing reset through the
// Phase 2 cloud clear/verification contract when the host wires these ops.
(function(global){
'use strict';

function requireFunction(value,name){
  if(typeof value!=='function') throw new Error('delete-all-data-runtime-missing:'+name);
  return value;
}

async function execute(options){
  const opt=options||{};
  const cloud=opt.cloud||global.MongoCloud;
  if(!cloud||typeof cloud.runSafeHardReset!=='function'){
    const error=new Error('DELETE_ALL_DATA_RESET_RUNTIME_UNAVAILABLE');
    error.code='DELETE_ALL_DATA_RESET_RUNTIME_UNAVAILABLE';
    throw error;
  }

  const emptyMemory=requireFunction(opt.emptyMemory,'emptyMemory');
  const purgeLocal=requireFunction(opt.purgeLocal,'purgeLocal');
  const clearFinancialData=requireFunction(opt.clearFinancialData,'clearFinancialData');
  const reload=typeof opt.reload==='function'?opt.reload:function(){
    if(global.location&&typeof global.location.reload==='function') global.location.reload();
  };

  // Do not hide a missing MongoCloud/module-load failure with optional chaining.
  // runSafeHardReset owns the destructive sequence:
  // memory -> local -> verified cloud clear -> memory -> local -> reload.
  return cloud.runSafeHardReset({
    emptyMemory,
    purgeLocal,
    clearFinancialData,
    reload
  });
}

global.MongoDeleteAllDataRuntime=Object.freeze({execute});
})(window);
