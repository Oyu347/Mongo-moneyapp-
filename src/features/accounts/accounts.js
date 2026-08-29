// Möngö Accounts — Phase 1B
// Pure compatibility helpers for account identity, metadata, totals and history.
// Balance calculation stays owned by MongoLedgerCore.

(function (global) {
  'use strict';

  function normalizeType(type) {
    return type === 'bank' ? 'checking' : (type || 'checking');
  }

  function isActive(account) {
    return !!account && account.active !== false;
  }

  function isSpendable(account) {
    return isActive(account) && ['checking', 'cash'].includes(normalizeType(account.type));
  }

  function isSavings(account) {
    return isActive(account) && normalizeType(account.type) === 'savings';
  }

  function defaultAccountId(accounts) {
    const list = Array.isArray(accounts) ? accounts : [];
    const account = list.find(a => isActive(a) && normalizeType(a.type) !== 'savings') ||
      list.find(isActive) || list[0];
    return account ? account.id : null;
  }

  function openingTotal(accounts, predicate) {
    const list = Array.isArray(accounts) ? accounts : [];
    return list.filter(a => !predicate || predicate(a))
      .reduce((sum, account) => sum + (Number(account.openingBalance) || 0), 0);
  }

  function earliestTransactionDate(transactions, fallbackDate) {
    const dates = (Array.isArray(transactions) ? transactions : [])
      .map(t => t?.date).filter(Boolean).sort();
    return dates[0] || fallbackDate || new Date().toISOString().slice(0, 10);
  }

  function makeLegacyAccount(openingBalance, transactions, language, fallbackDate) {
    return {
      id: 'legacy_main',
      name: language === 'mn' ? 'Эхний мөнгө' : 'Opening money',
      type: 'cash',
      startDate: earliestTransactionDate(transactions, fallbackDate),
      openingBalance: Math.max(0, Number(openingBalance) || 0),
      active: true,
      legacy: true
    };
  }

  function normalizeMetadata(accounts) {
    const list = Array.isArray(accounts) ? accounts : [];
    list.forEach(account => {
      if (!account || typeof account !== 'object') return;
      account.type = normalizeType(account.type);
      account.openingBalance = Math.max(0, Number(account.openingBalance) || 0);
      if (account.active == null) account.active = true;
    });
    return list;
  }

  function ensureLegacyAccount(accounts, openingBalance, transactions, language, fallbackDate) {
    const list = normalizeMetadata(Array.isArray(accounts) ? accounts : []);
    if (!list.length) list.push(makeLegacyAccount(openingBalance, transactions, language, fallbackDate));
    return list;
  }

  function assignMissingTransactionAccounts(transactions, accountId) {
    if (!accountId) return transactions || [];
    (Array.isArray(transactions) ? transactions : []).forEach(transaction => {
      if (transaction && !transaction.accountId) transaction.accountId = accountId;
    });
    return transactions || [];
  }

  function accountTotal(accounts, ledger, predicate) {
    const list = Array.isArray(accounts) ? accounts : [];
    if (!global.MongoLedgerCore) throw new Error('MongoLedgerCore is required before MongoAccounts');
    return list.filter(a => !predicate || predicate(a))
      .reduce((sum, account) => sum + global.MongoLedgerCore.accountBalance(account.id, list, ledger || []), 0);
  }

  function transferRows(accountId, accounts, transfers, assetNameForTarget) {
    const id = String(accountId ?? '');
    const list = Array.isArray(accounts) ? accounts : [];
    const rows = [];
    (Array.isArray(transfers) ? transfers : []).forEach(transfer => {
      const amount = Number(transfer?.amount) || 0;
      if (String(transfer?.fromId ?? '') === id) {
        const other = list.find(a => String(a?.id) === String(transfer?.toId));
        const assetName = transfer?.purpose === 'asset' && typeof assetNameForTarget === 'function'
          ? assetNameForTarget(transfer.targetId) : '';
        rows.push({ date: transfer?.date, label: '→ ' + (assetName || other?.name || '—'), amount: -amount, kind: 'transfer' });
      }
      if (String(transfer?.toId ?? '') === id) {
        const other = list.find(a => String(a?.id) === String(transfer?.fromId));
        rows.push({ date: transfer?.date, label: '← ' + (other?.name || '—'), amount, kind: 'transfer' });
      }
    });
    return rows.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  }

  function canDeactivate(accountId, accounts, ledger, tolerance = 0.001) {
    if (!global.MongoLedgerCore) throw new Error('MongoLedgerCore is required before MongoAccounts');
    return Math.abs(global.MongoLedgerCore.accountBalance(accountId, accounts || [], ledger || [])) <= tolerance;
  }

  global.MongoAccounts = Object.freeze({
    normalizeType,
    isActive,
    isSpendable,
    isSavings,
    defaultAccountId,
    openingTotal,
    earliestTransactionDate,
    makeLegacyAccount,
    normalizeMetadata,
    ensureLegacyAccount,
    assignMissingTransactionAccounts,
    accountTotal,
    transferRows,
    canDeactivate
  });
})(window);
