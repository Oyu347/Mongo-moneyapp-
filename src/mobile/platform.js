// Möngö Mobile — Phase 1A
// Platform detection/capability boundary only. No financial, Cloud, storage or UI policy.
(function(global){
'use strict';
function capacitor(env){const w=env||global;return w&&w.Capacitor||null;}
function isNative(env){const c=capacitor(env);if(!c)return false;if(typeof c.isNativePlatform==='function')return !!c.isNativePlatform();if(typeof c.getPlatform==='function')return c.getPlatform()!=='web';return false;}
function platform(env){const c=capacitor(env);if(c&&typeof c.getPlatform==='function')return String(c.getPlatform()||'web');return 'web';}
function capabilities(env){const w=env||global,c=capacitor(w);return Object.freeze({capacitor:!!c,native:isNative(w),platform:platform(w),touch:!!(w&&(('ontouchstart' in w)||(w.navigator&&Number(w.navigator.maxTouchPoints)>0))),safeAreaCss:true});}
global.MongoMobile=Object.freeze({capacitor,isNative,platform,capabilities});
})(window);
