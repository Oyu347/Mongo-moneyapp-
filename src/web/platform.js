// Möngö Web — Phase 1A
// Browser/platform compatibility only. No financial, Firebase, storage or UI policy logic.
(function(global){
'use strict';
function capabilities(env){
  const w=env||global,n=w&&w.navigator,d=w&&w.document,u=w&&w.URL;
  return Object.freeze({
    dom:!!(d&&typeof d.createElement==='function'),
    blob:typeof (w&&w.Blob)==='function',
    objectUrl:!!(u&&typeof u.createObjectURL==='function'),
    fileReader:typeof (w&&w.FileReader)==='function',
    reload:!!(w&&w.location&&typeof w.location.reload==='function'),
    online:!!(n&&typeof n.onLine==='boolean')
  });
}
function canDownload(env){const c=capabilities(env);return c.dom&&c.blob&&c.objectUrl;}
function downloadText(text,filename,mime,env){
  const w=env||global,d=w&&w.document,u=w&&w.URL,B=w&&w.Blob;
  if(!canDownload(w))return false;
  const blob=new B([String(text==null?'':text)],{type:mime||'text/plain'});
  const href=u.createObjectURL(blob),a=d.createElement('a');
  a.href=href;a.download=String(filename||'download.txt');a.click();
  if(typeof u.revokeObjectURL==='function')setTimeout(()=>u.revokeObjectURL(href),0);
  return true;
}
function readTextFile(file,handlers,env){
  const w=env||global,R=w&&w.FileReader,h=handlers||{};
  if(!file||typeof R!=='function')return false;
  const reader=new R();
  reader.onload=function(ev){if(typeof h.load==='function')h.load(ev&&ev.target?ev.target.result:reader.result,ev);};
  reader.onerror=function(ev){if(typeof h.error==='function')h.error(ev);};
  reader.readAsText(file);return true;
}
function reload(delay,env){const w=env||global;if(!(w&&w.location&&typeof w.location.reload==='function'))return false;if(Number(delay)>0)setTimeout(()=>w.location.reload(),Number(delay));else w.location.reload();return true;}
global.MongoWeb=Object.freeze({capabilities,canDownload,downloadText,readTextFile,reload});
})(window);
