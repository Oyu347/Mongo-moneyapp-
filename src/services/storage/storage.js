// Möngö local storage service
// V44 modularization foundation.
// Compatibility-first wrapper: callers can migrate incrementally without
// changing the stored keys or serialized data format.

(function (global) {
  'use strict';

  const nativeStorage = global.localStorage;

  function get(key, fallback = null) {
    try {
      const value = nativeStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      console.warn('[Möngö storage] get failed:', key, error);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      nativeStorage.setItem(key, String(value));
      return true;
    } catch (error) {
      console.warn('[Möngö storage] set failed:', key, error);
      return false;
    }
  }

  function remove(key) {
    try {
      nativeStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('[Möngö storage] remove failed:', key, error);
      return false;
    }
  }

  function getJSON(key, fallback = null) {
    const raw = get(key, null);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn('[Möngö storage] invalid JSON:', key, error);
      return fallback;
    }
  }

  function setJSON(key, value) {
    try {
      return set(key, JSON.stringify(value));
    } catch (error) {
      console.warn('[Möngö storage] JSON stringify failed:', key, error);
      return false;
    }
  }

  function has(key) {
    return get(key, null) !== null;
  }

  function keys() {
    try {
      const out = [];
      for (let i = 0; i < nativeStorage.length; i += 1) {
        const key = nativeStorage.key(i);
        if (key !== null) out.push(key);
      }
      return out;
    } catch (error) {
      console.warn('[Möngö storage] keys failed:', error);
      return [];
    }
  }

  global.MongoStorage = Object.freeze({ get, set, remove, getJSON, setJSON, has, keys });
})(window);
