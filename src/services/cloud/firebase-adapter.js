// Möngö Firebase adapter contract — validation scaffold only.
// No Firebase SDK import, network request, write, delete, or production credential is performed here.
(function(global){
'use strict';
function assertDriver(driver){
  const d=driver||{};
  const required=['loadCanonical','writeCanonical'];
  const missing=required.filter(k=>typeof d[k]!=='function');
  return {valid:missing.length===0,missing};
}
function createFirebaseAdapter(driver){
  const check=assertDriver(driver);
  if(!check.valid) throw new Error('Invalid Firebase driver: missing '+check.missing.join(', '));
  return Object.freeze({
    async load(uid){
      if(!uid) throw new Error('uid required');
      return driver.loadCanonical(uid);
    },
    async write(uid,metadata){
      if(!uid) throw new Error('uid required');
      if(!metadata||!metadata.data) throw new Error('metadata.data required');
      return driver.writeCanonical(uid,metadata);
    },
    capabilities:Object.freeze({networkOwnedByDriver:true,destructiveDelete:false,clearUsesTombstone:true})
  });
}
global.MongoFirebaseAdapter=Object.freeze({assertDriver,createFirebaseAdapter});
})(window);
