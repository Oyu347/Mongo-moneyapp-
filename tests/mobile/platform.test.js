'use strict';
const assert=require('assert');global.window=global;require('../../src/mobile/platform.js');const M=global.MongoMobile;
assert.strictEqual(M.platform({}),'web');assert.strictEqual(M.isNative({}),false);
const android={Capacitor:{getPlatform:()=> 'android',isNativePlatform:()=>true},navigator:{maxTouchPoints:5}};
assert.strictEqual(M.platform(android),'android');assert.strictEqual(M.isNative(android),true);assert.strictEqual(M.capabilities(android).touch,true);
const ios={Capacitor:{getPlatform:()=> 'ios'}};assert.strictEqual(M.platform(ios),'ios');assert.strictEqual(M.isNative(ios),true);
const web={Capacitor:{getPlatform:()=> 'web',isNativePlatform:()=>false}};assert.strictEqual(M.isNative(web),false);
console.log('Möngö mobile platform regression tests: PASS');
