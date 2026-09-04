// Möngö unified money ledger — Core Phase 1
// Compatibility-first extraction from the V44 unified ledger.
// This module is intentionally pure: it does not render UI, persist data,
// or call Firebase. Existing inline behavior remains authoritative until
// callers are migrated and regression-tested.

(function (global) {
  'use strict';

  const LEDGER_KINDS = Object.freeze([
    'income',
    'expense',
    'transfer',
    'savings_transfer',
    'investment_contribution',
    'loan_received',
    'loan_payment',
    'asset_purchase',
    'asset_income',
    'savings_interest'
  ]);
  const LEDGER_KIND_SET = new Set(LEDGER_KINDS);

  const cleanId = value => String(value ?? '');

  function clone(value) {
    if (value == null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function ledgerKindForTransaction(transaction) {
    const t = transaction || {};
    if (t.assetIncome) return 'asset_income';
    if (t.savingsInterest) return 'savings_interest';
    return t.type === 'income' ? 'income' : 'expense';
  }

  function ledgerKindForTransfer(transfer) {
    const t = transfer || {};
    if (t.purpose === 'savings') return 'savings_transfer';
    if (t.purpose === 'investment') return 'investment_contribution';
    if (t.purpose === 'asset') return 'asset_purchase';
    return 'transfer';
  }

  function makeTransactionEntry(transaction, previous, timestamp) {
    const t = transaction || {};
    const now = timestamp || new Date().toISOString();
    return {
      id: `txn:${cleanId(t.id)}`,
      kind: ledgerKindForTransaction(t),
      amount: Number(t.amount) || 0,
      date: t.date,
      fromAccountId: t.type === 'expense' ? cleanId(t.accountId) : '',
      toAccountId: t.type === 'income' ? cleanId(t.accountId) : '',
      categoryKey: t.catKey || '',
      subcategoryKey: t.subcatKey || t.subcatName || '',
      description: t.desc || '',
      assetId: t.assetGroupKey || '',
      goalId: t.goalId || '',
      sourceId: cleanId(t.id),
      data: clone(t),
      createdAt: previous?.createdAt || t.createdAt || now,
      updatedAt: t.updatedAt || now
    };
  }

  function makeTransferEntry(transfer, previous, timestamp) {
    const t = transfer || {};
    const now = timestamp || new Date().toISOString();
    return {
      id: `transfer:${cleanId(t.id)}`,
      kind: ledgerKindForTransfer(t),
      amount: Number(t.amount) || 0,
      date: t.date,
      fromAccountId: cleanId(t.fromId),
      toAccountId: cleanId(t.toId),
      goalId: t.purpose === 'savings' ? cleanId(t.targetId) : '',
      assetId: (t.purpose === 'asset' || t.purpose === 'investment') ? cleanId(t.targetId || t.assetId) : '',
      sourceId: cleanId(t.id),
      data: clone(t),
      createdAt: previous?.createdAt || t.createdAt || t.updatedAt || now,
      updatedAt: t.updatedAt || now
    };
  }

  function makeLoanFundingEntry(debt, previous, timestamp) {
    const d = debt || {};
    const now = timestamp || new Date().toISOString();
    return {
      id: `loan-received:${cleanId(d.id)}`,
      kind: 'loan_received',
      amount: Number(d.fundingAmount) || 0,
      date: d.startDate || String(d.createdAt || '').slice(0, 10),
      toAccountId: cleanId(d.fundingAccountId),
      loanId: cleanId(d.id),
      description: d.name || '',
      sourceId: cleanId(d.id),
      createdAt: previous?.createdAt || d.createdAt || now,
      updatedAt: d.updatedAt || now
    };
  }

  function makeLoanPaymentEntry(debt, payment, previous, timestamp) {
    const d = debt || {};
    const p = payment || {};
    const now = timestamp || new Date().toISOString();
    return {
      id: `loan-payment:${cleanId(p.id)}`,
      kind: 'loan_payment',
      amount: Number(p.total) || 0,
      date: p.date,
      fromAccountId: cleanId(p.accountId),
      loanId: cleanId(d.id),
      description: d.name || '',
      sourceId: cleanId(p.id),
      principal: Number(p.principal) || 0,
      interest: Number(p.interest) || 0,
      extraPrincipal: Number(p.extraPrincipal) || 0,
      createdAt: previous?.createdAt || p.createdAt || now,
      updatedAt: p.updatedAt || now
    };
  }

  function buildLedger(state, previousLedger, timestamp) {
    const source = state || {};
    const previous = new Map((previousLedger || []).map(entry => [cleanId(entry?.id), entry]));
    const next = [];

    (source.txns || [])
      .filter(t => t && !t.loanPaymentId && (t.type === 'income' || t.type === 'expense'))
      .forEach(t => next.push(makeTransactionEntry(t, previous.get(`txn:${cleanId(t.id)}`), timestamp)));

    (source.accountTransfers || [])
      .forEach(t => next.push(makeTransferEntry(t, previous.get(`transfer:${cleanId(t.id)}`), timestamp)));

    (source.debts || []).forEach(d => {
      if (d && d.fundingMode === 'existing' && Number(d.fundingAmount) > 0 && d.fundingAccountId) {
        next.push(makeLoanFundingEntry(d, previous.get(`loan-received:${cleanId(d.id)}`), timestamp));
      }
      (Array.isArray(d?.payments) ? d.payments : []).forEach(p => {
        next.push(makeLoanPaymentEntry(d, p, previous.get(`loan-payment:${cleanId(p.id)}`), timestamp));
      });
    });

    return next.sort((a, b) =>
      String(b.date || '').localeCompare(String(a.date || '')) ||
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    );
  }

  function accountBalance(accountId, accounts, ledger) {
    const id = cleanId(accountId);
    const account = (accounts || []).find(a => cleanId(a?.id) === id);
    if (!account) return 0;

    let value = Number(account.openingBalance) || 0;
    (ledger || []).forEach(entry => {
      const amount = Number(entry?.amount) || 0;
      if (cleanId(entry?.fromAccountId) === id) value -= amount;
      if (cleanId(entry?.toAccountId) === id) value += amount;
    });
    return value;
  }

  function totalAccountMoney(accounts, ledger) {
    return (accounts || []).reduce((sum, account) => sum + accountBalance(account?.id, accounts, ledger), 0);
  }

  function validateLedger(ledger) {
    const issues = [];
    const seen = new Set();

    (ledger || []).forEach(entry => {
      const id = cleanId(entry?.id);
      if (!id || seen.has(id)) issues.push(`Давхардсан бүртгэл: ${id || 'ID байхгүй'}`);
      seen.add(id);
      if (!LEDGER_KIND_SET.has(entry?.kind)) issues.push(`Төрөл буруу: ${entry?.kind}`);
      if (!(Number(entry?.amount) > 0)) issues.push(`Дүн буруу: ${id}`);
      if (entry?.kind === 'loan_payment') {
        const split = (Number(entry.principal) || 0) + (Number(entry.interest) || 0) + (Number(entry.extraPrincipal) || 0);
        if (Math.abs(split - (Number(entry.amount) || 0)) > 1) {
          issues.push(`Зээлийн төлөлтийн задаргаа зөрсөн: ${id}`);
        }
      }
    });

    return issues;
  }

  function expectedLedgerIds(state) {
    const source = state || {};
    const ids = [];
    (source.txns || []).filter(t => t && !t.loanPaymentId && (t.type === 'income' || t.type === 'expense'))
      .forEach(t => ids.push(`txn:${cleanId(t.id)}`));
    (source.accountTransfers || []).forEach(t => ids.push(`transfer:${cleanId(t.id)}`));
    (source.debts || []).forEach(d => {
      if (d && d.fundingMode === 'existing' && Number(d.fundingAmount) > 0 && d.fundingAccountId) ids.push(`loan-received:${cleanId(d.id)}`);
      (Array.isArray(d?.payments) ? d.payments : []).forEach(p => ids.push(`loan-payment:${cleanId(p.id)}`));
    });
    return ids;
  }

  function needsRebuild(state, ledger) {
    const expected = expectedLedgerIds(state);
    const actual = new Set((ledger || []).map(entry => cleanId(entry?.id)));
    return actual.size !== expected.length || expected.some(id => !actual.has(id));
  }

  global.MongoLedgerCore = Object.freeze({
    LEDGER_KINDS,
    cleanId,
    ledgerKindForTransaction,
    ledgerKindForTransfer,
    makeTransactionEntry,
    makeTransferEntry,
    makeLoanFundingEntry,
    makeLoanPaymentEntry,
    buildLedger,
    accountBalance,
    totalAccountMoney,
    validateLedger,
    expectedLedgerIds,
    needsRebuild
  });
})(window);
