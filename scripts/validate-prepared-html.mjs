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
 const re=new RegExp('<script[^>]+src=["\\\']'+src.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'["\\\'][^>]*>\\s*</script>','gi');
 const matches=[...html.matchAll(re)];
 if(matches.length!==1)errors.push(`${src}: expected once, found ${matches.length}`);
 if(matches.length===1){if(matches[0].index<=last)errors.push(`${src}: dependency order violation`);last=matches[0].index;}
}
const inline=[];for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){if(m[1].trim())inline.push(m[1]);}
if(inline.length!==44)errors.push(`inline scripts: expected 44, found ${inline.length}`);
inline.forEach((code,i)=>{try{new vm.Script(code,{filename:`inline-${i+1}.js`});}catch(e){errors.push(`inline-${i+1}: ${e.message}`);}});
if(errors.length){console.error('Prepared HTML validation: FAIL');errors.forEach(e=>console.error('- '+e));process.exit(1);}
console.log(`Prepared HTML validation: PASS (${required.length} modules, ${inline.length} inline scripts)`);
