'use strict';
const assert=require('assert');
global.window=global;
require('../../src/services/cloud/cloud.js');
const C=global.MongoCloud;

// A financial snapshot is not safe merely because it contains transactions.
// Core collections that already exist locally must not silently disappear when
// a partial cloud/legacy snapshot is selected as a full replacement.
const local={
 clientUpdatedAt:'2026-08-31T03:00:00Z',
 txns:[{id:'income-1'}],
 budgets:[{id:'budget-1'}],
 goals:[{id:'goal-1'}],
 debts:[{id:'loan-1'}],
 invests:[{id:'asset-1'}],
 moneyAccounts:[{id:'bank-1'}],
 accountTransfers:[{id:'loan-payment-1'}]
};
const partialCloud={
 clientUpdatedAt:'2026-08-31T04:00:00Z',
 txns:[{id:'income-1'}],
 moneyAccounts:[{id:'bank-1'}]
};

assert.strictEqual(typeof C.financialStateCoverage,'function','cloud policy must expose financial state coverage');
assert.strictEqual(typeof C.partialReplacementRisk,'function','cloud policy must expose partial replacement risk');

const localCoverage=C.financialStateCoverage(local);
const cloudCoverage=C.financialStateCoverage(partialCloud);
assert(localCoverage.present.includes('budgets'));
assert(localCoverage.present.includes('goals'));
assert(localCoverage.present.includes('debts'));
assert(localCoverage.present.includes('invests'));
assert(cloudCoverage.missing.includes('budgets'));
assert(cloudCoverage.missing.includes('goals'));
assert(cloudCoverage.missing.includes('debts'));
assert(cloudCoverage.missing.includes('invests'));

const risk=C.partialReplacementRisk({current:local,incoming:partialCloud});
assert.strictEqual(risk.risky,true,'partial incoming state must not be treated as a safe full replacement');
assert(risk.lostCollections.includes('budgets'));
assert(risk.lostCollections.includes('goals'));
assert(risk.lostCollections.includes('debts'));
assert(risk.lostCollections.includes('invests'));
assert(risk.lostCollections.includes('accountTransfers'));

// A complete incoming state, including intentionally empty arrays, is safe:
// presence is distinct from an omitted collection.
const complete=Object.assign({},partialCloud,{budgets:[],goals:[],debts:[],invests:[],accountTransfers:[]});
assert.strictEqual(C.partialReplacementRisk({current:local,incoming:complete}).risky,false);

console.log('Möngö partial financial state preservation regression: PASS');
