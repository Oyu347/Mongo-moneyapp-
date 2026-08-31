'use strict';
const assert=require('assert');
global.window=global;
require('../../src/services/cloud/cloud.js');
const C=global.MongoCloud;

const local={
 clientUpdatedAt:'2026-08-31T03:00:00Z',
 txns:[{id:'income-1'}],budgets:[{id:'budget-1'}],goals:[{id:'goal-1'}],debts:[{id:'loan-1'}],invests:[{id:'asset-1'}],moneyAccounts:[{id:'bank-1'}],accountTransfers:[{id:'loan-payment-1'}]
};
const partialCloud={clientUpdatedAt:'2026-08-31T04:00:00Z',txns:[{id:'income-1'}],moneyAccounts:[{id:'bank-1'}]};

assert.strictEqual(typeof C.financialStateCoverage,'function');
assert.strictEqual(typeof C.partialReplacementRisk,'function');
assert.strictEqual(typeof C.safeReplacementDecision,'function','runtime apply path needs a safe replacement decision');

const localCoverage=C.financialStateCoverage(local),cloudCoverage=C.financialStateCoverage(partialCloud);
['budgets','goals','debts','invests'].forEach(k=>assert(localCoverage.present.includes(k)));
['budgets','goals','debts','invests'].forEach(k=>assert(cloudCoverage.missing.includes(k)));

const risk=C.partialReplacementRisk({current:local,incoming:partialCloud});
assert.strictEqual(risk.risky,true);
['budgets','goals','debts','invests','accountTransfers'].forEach(k=>assert(risk.lostCollections.includes(k)));

// Runtime must keep the current complete state rather than reset it with a partial snapshot.
let decision=C.safeReplacementDecision({current:local,incoming:partialCloud,source:'cloud'});
assert.strictEqual(decision.apply,false);
assert.strictEqual(decision.reason,'partial-state-risk');
assert.strictEqual(decision.data,local);
assert(decision.lostCollections.includes('debts'));

// A complete incoming state, including intentionally empty arrays, is explicit and safe.
const complete=Object.assign({},partialCloud,{budgets:[],goals:[],debts:[],invests:[],accountTransfers:[]});
decision=C.safeReplacementDecision({current:local,incoming:complete,source:'cloud'});
assert.strictEqual(decision.apply,true);
assert.strictEqual(decision.data,complete);

// Explicit clear/tombstone remains authoritative and must not be blocked by preservation logic.
decision=C.safeReplacementDecision({current:local,incoming:complete,source:'cloud-cleared',allowExplicitClear:true});
assert.strictEqual(decision.apply,true);

console.log('Möngö partial financial state preservation regression: PASS');
