import fs from 'node:fs';

const file = process.argv[2] || 'index.html';
const html = fs.readFileSync(file, 'utf8');
const tag = '<script src="src/services/cloud/cloud.js"></script>';
const needle = 'async function writeCloud(data,reason,expectedUid){';

const tagCount = html.split(tag).length - 1;
if (tagCount > 1) throw new Error(`cloud runtime tag appears ${tagCount} times`);
if (tagCount === 1) {
  console.log('Cloud runtime already wired exactly once; no change needed.');
  process.exit(0);
}

const needleCount = html.split(needle).length - 1;
if (needleCount !== 1) throw new Error(`expected exactly one writeCloud anchor, found ${needleCount}`);

const needlePos = html.indexOf(needle);
const scriptOpen = html.lastIndexOf('<script', needlePos);
if (scriptOpen < 0) throw new Error('could not find containing script tag before writeCloud');
const scriptOpenEnd = html.indexOf('>', scriptOpen);
if (scriptOpenEnd < 0 || scriptOpenEnd > needlePos) throw new Error('invalid containing script tag');

const openingTag = html.slice(scriptOpen, scriptOpenEnd + 1);
if (/\bsrc\s*=/.test(openingTag)) throw new Error(`writeCloud unexpectedly lives in external script: ${openingTag}`);

const before = html.slice(0, scriptOpen);
const after = html.slice(scriptOpen);
const patched = `${before}${tag}\n${after}`;

if ((patched.split(tag).length - 1) !== 1) throw new Error('postcondition failed: cloud runtime tag count is not one');
if (patched.indexOf(tag) > patched.indexOf(needle)) throw new Error('postcondition failed: cloud runtime loads after writeCloud');
if (patched.length !== html.length + tag.length + 1) throw new Error('postcondition failed: unexpected patch size');

fs.writeFileSync(file, patched, 'utf8');
console.log(`Wired Cloud runtime immediately before the inline script containing writeCloud in ${file}.`);
