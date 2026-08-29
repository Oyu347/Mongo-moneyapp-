// Möngö local storage service
// V44 modularization foundation.
//
// IMPORTANT:
// This module starts as a compatibility wrapper only.
// Existing index.html storage behavior remains untouched until each caller
// is migrated and tested on development-modular.

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

  global.MongoStorage = Object.freeze({
    get,
    set,
    remove,
    getJSON,
    setJSON
  });
})(window);
