// Möngö i18n dictionaries — Phase 1D extraction boundary
// Keeps dictionary ownership separate from lookup logic while preserving current inline source during staged migration.
(function(global){
'use strict';
let LANGS=null;
function register(langs){LANGS=langs||{};return LANGS;}
function get(){return LANGS||{};}
function locale(code){const all=get();return all&&all[code]||{};}
function snapshot(){const all=get(),out={};Object.keys(all).forEach(k=>{out[k]=Object.assign({},all[k]);});return out;}
global.MongoDictionaries=Object.freeze({register,get,locale,snapshot});
})(window);
