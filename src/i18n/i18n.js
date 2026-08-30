// Möngö i18n — Phase 1C
// Pure seven-language compatibility helpers. Dictionaries and DOM application remain inline initially.
(function(global){
'use strict';
const LOCALES=Object.freeze(['mn','en','zh','ja','ko','ru','de']);
const DEFAULT_LOCALE='mn';
const CURRENCY=Object.freeze({mn:'₮',en:'$',zh:'¥',ja:'¥',ko:'₩',ru:'₽',de:'€'});
function hasLocale(locale){return LOCALES.includes(String(locale||''));}
function normalizeLocale(locale){return hasLocale(locale)?String(locale):DEFAULT_LOCALE;}
function language(dictionaries,locale){const l=normalizeLocale(locale);return (dictionaries&&dictionaries[l])||(dictionaries&&dictionaries[DEFAULT_LOCALE])||{};}
function currency(locale){return CURRENCY[normalizeLocale(locale)]||'$';}
function ownValue(dictionary,key,fallback){return dictionary&&Object.prototype.hasOwnProperty.call(dictionary,key)?dictionary[key]:fallback;}
function value(dictionaries,locale,key,fallback){const current=language(dictionaries,locale),mn=language(dictionaries,DEFAULT_LOCALE);if(current&&Object.prototype.hasOwnProperty.call(current,key))return current[key];if(mn&&Object.prototype.hasOwnProperty.call(mn,key))return mn[key];return fallback;}
function categoryLabel(labels,key,locale,fallback){const row=labels&&labels[key],l=normalizeLocale(locale);if(row&&Object.prototype.hasOwnProperty.call(row,l))return row[l];if(row&&Object.prototype.hasOwnProperty.call(row,DEFAULT_LOCALE))return row[DEFAULT_LOCALE];return fallback===undefined?key:fallback;}
function namedLabel(names,locale,fallback){const l=normalizeLocale(locale);if(names&&Object.prototype.hasOwnProperty.call(names,l))return names[l];if(names&&Object.prototype.hasOwnProperty.call(names,DEFAULT_LOCALE))return names[DEFAULT_LOCALE];if(names&&Object.prototype.hasOwnProperty.call(names,'en'))return names.en;const first=names&&Object.values(names)[0];return first===undefined?fallback:first;}
function missingKeys(dictionaries,locale,referenceLocale){const ref=language(dictionaries,referenceLocale||DEFAULT_LOCALE),cur=language(dictionaries,locale);return Object.keys(ref||{}).filter(k=>!Object.prototype.hasOwnProperty.call(cur||{},k));}
function keyParity(dictionaries){const out={};LOCALES.forEach(l=>out[l]=missingKeys(dictionaries,l,DEFAULT_LOCALE));return out;}
global.MongoI18n=Object.freeze({LOCALES,DEFAULT_LOCALE,CURRENCY,hasLocale,normalizeLocale,language,currency,ownValue,value,categoryLabel,namedLabel,missingKeys,keyParity});
})(window);
