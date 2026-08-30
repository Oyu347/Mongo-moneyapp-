// Möngö Mobile — Phase 1C
// Platform/shell compatibility only. No financial, Cloud, storage, auth, payment or UI routing policy.
(function(global){
'use strict';
function capacitor(env){const w=env||global;return w&&w.Capacitor||null;}
function isNative(env){const c=capacitor(env);if(!c)return false;if(typeof c.isNativePlatform==='function')return !!c.isNativePlatform();if(typeof c.getPlatform==='function')return c.getPlatform()!=='web';return false;}
function platform(env){const c=capacitor(env);if(c&&typeof c.getPlatform==='function')return String(c.getPlatform()||'web');return 'web';}
function plugin(name,env){const c=capacitor(env);const p=c&&c.Plugins;return p&&name?p[name]||null:null;}
function normalizeAppState(event){const e=event||{};return Object.freeze({active:!!e.isActive});}
function normalizeDeepLink(event,env){const raw=event&&typeof event.url==='string'?event.url.trim():'';if(!raw)return Object.freeze({url:'',protocol:'',host:'',pathname:'',search:'',hash:'',valid:false});try{const w=env||global;const U=w&&w.URL?w.URL:URL;const u=new U(raw);return Object.freeze({url:u.href,protocol:u.protocol||'',host:u.host||'',pathname:u.pathname||'',search:u.search||'',hash:u.hash||'',valid:true});}catch(_){return Object.freeze({url:raw,protocol:'',host:'',pathname:'',search:'',hash:'',valid:false});}}
function capabilities(env){const w=env||global,c=capacitor(w);return Object.freeze({capacitor:!!c,native:isNative(w),platform:platform(w),touch:!!(w&&(('ontouchstart' in w)||(w.navigator&&Number(w.navigator.maxTouchPoints)>0))),safeAreaCss:true,appPlugin:!!plugin('App',w),keyboardPlugin:!!plugin('Keyboard',w),statusBarPlugin:!!plugin('StatusBar',w),filesystemPlugin:!!plugin('Filesystem',w),sharePlugin:!!plugin('Share',w)});}
global.MongoMobile=Object.freeze({capacitor,isNative,platform,plugin,normalizeAppState,normalizeDeepLink,capabilities});
})(window);
