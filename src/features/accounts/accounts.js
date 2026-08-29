// Möngö Accounts — Phase 1A
// Pure compatibility helpers for account identity, type, totals and history.
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
        rows.push({
          date: transfer?.date,
          label: '→ ' + (assetName || other?.name || '—'),
          amount: -amount,
          kind: 'transfer'
        });
      }
      if (String(transfer?.toId ?? '') === id) {
        const other = list.find(a => String(a?.id) === String(transfer?.fromId));
        rows.push({
          date: transfer?.date,
          label: '← ' + (other?.name || '—'),
          amount,
          kind: 'transfer'
        });
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
    accountTotal,
    transferRows,
    canDeactivate
  });
})(window);
