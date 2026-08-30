// Möngö Mobile — Phase 1B
// Platform/shell capability boundary only. No financial, Cloud, storage or UI policy.
(function(global){
'use strict';
function capacitor(env){const w=env||global;return w&&w.Capacitor||null;}
function isNative(env){const c=capacitor(env);if(!c)return false;if(typeof c.isNativePlatform==='function')return !!c.isNativePlatform();if(typeof c.getPlatform==='function')return c.getPlatform()!=='web';return false;}
function platform(env){const c=capacitor(env);if(c&&typeof c.getPlatform==='function')return String(c.getPlatform()||'web');return 'web';}
function plugin(name,env){const c=capacitor(env);const p=c&&c.Plugins;return p&&name?p[name]||null:null;}
function capabilities(env){const w=env||global,c=capacitor(w);return Object.freeze({capacitor:!!c,native:isNative(w),platform:platform(w),touch:!!(w&&(('ontouchstart' in w)||(w.navigator&&Number(w.navigator.maxTouchPoints)>0))),safeAreaCss:true,appPlugin:!!plugin('App',w),keyboardPlugin:!!plugin('Keyboard',w),statusBarPlugin:!!plugin('StatusBar',w),filesystemPlugin:!!plugin('Filesystem',w),sharePlugin:!!plugin('Share',w)});}
global.MongoMobile=Object.freeze({capacitor,isNative,platform,plugin,capabilities});
})(window);
