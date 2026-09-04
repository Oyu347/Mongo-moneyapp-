#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';

const arg=process.argv.indexOf('--input');
if(arg<0||!process.argv[arg+1]){console.error('Usage: node scripts/validate-prepared-html.mjs --input <html>');process.exit(2);}
const file=process.argv[arg+1];
const html=fs.readFileSync(file,'utf8');
const required=[
 'src/services/storage/storage.js','src/core/ledger.js','src/features/accounts/accounts.js','src/features/transactions/transactions.js','src/features/loans/loans.js','src/features/savings/savings.js','src/features/assets/assets.js','src/features/budget/budget.js','src/services/cloud/cloud.js','src/audit/audit.js','src/i18n/dictionaries.js','src/i18n/i18n.js','src/web/platform.js','src/mobile/platform.js'
];
let last=-1;const errors=[];
for(const src of required){
 const escaped=src.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const external=new RegExp('<script[^>]+src=["\\\']'+escaped+'["\\\'][^>]*>\\s*</script>','gi');
 const externalMatches=[...html.matchAll(external)];
 // Android content:// checkpoints may inline an exact extracted module because relative
 // repository scripts are not loadable there. Count that explicit compatibility form too.
 const base=src.split('/').pop().replace(/\.js$/,'').replace(/[^a-z0-9]+/gi,'-');
 const inlineId=new RegExp('<script[^>]+id=["\\\']mongo-'+base+'-inline["\\\'][^>]*>','gi');
 const inlineMatches=[...html.matchAll(inlineId)];
 const matches=[...externalMatches,...inlineMatches].sort((a,b)=>a.index-b.index);
 if(matches.length!==1)errors.push(`${src}: expected one external or explicit inline module, found ${matches.length}`);
 if(matches.length===1){if(matches[0].index<=last)errors.push(`${src}: dependency order violation`);last=matches[0].index;}
}
const inline=[];for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){if(m[1].trim())inline.push(m[1]);}
// Historical Phase-1 closure had 44 inline blocks. The clean Android runtime checkpoint
// has 53 after compatibility integration and removal of QA-only controls.
const expectedInline=process.env.MONGO_EXPECT_INLINE?Number(process.env.MONGO_EXPECT_INLINE):null;
if(expectedInline!==null&&Number.isFinite(expectedInline)&&inline.length!==expectedInline)errors.push(`inline scripts: expected ${expectedInline}, found ${inline.length}`);
inline.forEach((code,i)=>{try{new vm.Script(code,{filename:`inline-${i+1}.js`});}catch(e){errors.push(`inline-${i+1}: ${e.message}`);}});
// Guard the calculator-language initialization regression found on Android Day 8.
if(/const\s+CALC_LANGS\s*=/.test(html))errors.push('CALC_LANGS: block-scoped declaration can be referenced before initialization');
if(/var\s+CALC_LANGS\s*=/.test(html)&&!/const\s+d\s*=\s*CALC_LANGS\s*\|\|\s*\{\}/.test(html))errors.push('CALC_LANGS: defensive CT() fallback not found');
if(errors.length){console.error('Prepared HTML validation: FAIL');errors.forEach(e=>console.error('- '+e));process.exit(1);}
console.log(`Prepared HTML validation: PASS (${required.length} modules, ${inline.length} inline scripts)`);
