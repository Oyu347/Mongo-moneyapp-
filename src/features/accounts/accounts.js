// Möngö Accounts — Phase 1D
// Pure compatibility helpers for account identity, metadata, totals and safe mutations.
// Balance calculation stays owned by MongoLedgerCore; UI/persistence stay outside this module.

(function (global) {
  'use strict';

  function normalizeType(type) { return type === 'bank' ? 'checking' : (type || 'checking'); }
  function isActive(account) { return !!account && account.active !== false; }
  function isSpendable(account) { return isActive(account) && ['checking', 'cash'].includes(normalizeType(account.type)); }
  function isSavings(account) { return isActive(account) && normalizeType(account.type) === 'savings'; }
  function cleanName(name) { return String(name == null ? '' : name).trim(); }
  function cleanDate(value, fallbackDate) { return value || fallbackDate || new Date().toISOString().slice(0, 10); }

  function defaultAccountId(accounts) {
    const list = Array.isArray(accounts) ? accounts : [];
    const account = list.find(a => isActive(a) && normalizeType(a.type) !== 'savings') || list.find(isActive) || list[0];
    return account ? account.id : null;
  }

  function openingTotal(accounts, predicate) {
    const list = Array.isArray(accounts) ? accounts : [];
    return list.filter(a => !predicate || predicate(a)).reduce((sum, account) => sum + (Number(account.openingBalance) || 0), 0);
  }

  function earliestTransactionDate(transactions, fallbackDate) {
    const dates = (Array.isArray(transactions) ? transactions : []).map(t => t?.date).filter(Boolean).sort();
    return dates[0] || fallbackDate || new Date().toISOString().slice(0, 10);
  }

  function makeLegacyAccount(openingBalance, transactions, language, fallbackDate) {
    return { id:'legacy_main', name:language === 'mn' ? 'Эхний мөнгө' : 'Opening money', type:'cash', startDate:earliestTransactionDate(transactions, fallbackDate), openingBalance:Math.max(0, Number(openingBalance) || 0), active:true, legacy:true };
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
    (Array.isArray(transactions) ? transactions : []).forEach(transaction => { if (transaction && !transaction.accountId) transaction.accountId = accountId; });
    return transactions || [];
  }

  function makeAccount(input, id, fallbackDate) {
    const source = input || {}, name = cleanName(source.name);
    if (!name) return { ok:false, reason:'name_required' };
    const accountId = id || source.id;
    if (!accountId) return { ok:false, reason:'id_required' };
    const type = normalizeType(source.type);
    const account = {
      id: accountId,
      name,
      type,
      startDate: cleanDate(source.startDate, fallbackDate),
      openingBalance: Math.max(0, Number(source.openingBalance) || 0),
      active: source.active !== false
    };
    if (type === 'savings') {
      const mode = source.interestMode || 'compound';
      account.interestMode = mode;
      account.annualInterestRate = mode === 'none' ? 0 : Math.max(0, Number(source.annualInterestRate) || 0);
      account.interestFrequency = mode === 'maturity' ? 'maturity' : (source.interestFrequency || 'monthly');
      account.interestAccountId = mode === 'payout' ? (source.interestAccountId || null) : accountId;
      account.linkedGoalId = source.linkedGoalId || null;
      account.maturityDate = source.maturityDate || '';
    }
    return { ok:true, account };
  }

  function editMetadata(account, patch) {
    if (!account || typeof account !== 'object') return { ok:false, reason:'not_found' };
    const source = patch || {}, name = source.name == null ? cleanName(account.name) : cleanName(source.name);
    if (!name) return { ok:false, reason:'name_required' };
    const type = normalizeType(source.type == null ? account.type : source.type);
    account.name = name;
    account.type = type;
    if (source.startDate != null) account.startDate = cleanDate(source.startDate, account.startDate);
    if (type === 'savings') {
      const mode = source.interestMode == null ? (account.interestMode || 'compound') : source.interestMode;
      account.interestMode = mode;
      account.annualInterestRate = mode === 'none' ? 0 : Math.max(0, Number(source.annualInterestRate == null ? account.annualInterestRate : source.annualInterestRate) || 0);
      account.interestFrequency = mode === 'maturity' ? 'maturity' : (source.interestFrequency || account.interestFrequency || 'monthly');
      account.interestAccountId = mode === 'payout' ? (source.interestAccountId || account.interestAccountId || null) : account.id;
      if (source.linkedGoalId !== undefined) account.linkedGoalId = source.linkedGoalId || null;
      if (source.maturityDate !== undefined) account.maturityDate = source.maturityDate || '';
    }
    return { ok:true, account };
  }

  function accountTotal(accounts, ledger, predicate) {
    const list = Array.isArray(accounts) ? accounts : [];
    if (!global.MongoLedgerCore) throw new Error('MongoLedgerCore is required before MongoAccounts');
    return list.filter(a => !predicate || predicate(a)).reduce((sum, account) => sum + global.MongoLedgerCore.accountBalance(account.id, list, ledger || []), 0);
  }

  function transferRows(accountId, accounts, transfers, assetNameForTarget) {
    const id = String(accountId ?? ''), list = Array.isArray(accounts) ? accounts : [], rows = [];
    (Array.isArray(transfers) ? transfers : []).forEach(transfer => {
      const amount = Number(transfer?.amount) || 0;
      if (String(transfer?.fromId ?? '') === id) {
        const other = list.find(a => String(a?.id) === String(transfer?.toId));
        const assetName = transfer?.purpose === 'asset' && typeof assetNameForTarget === 'function' ? assetNameForTarget(transfer.targetId) : '';
        rows.push({date:transfer?.date,label:'→ '+(assetName||other?.name||'—'),amount:-amount,kind:'transfer'});
      }
      if (String(transfer?.toId ?? '') === id) {
        const other = list.find(a => String(a?.id) === String(transfer?.fromId));
        rows.push({date:transfer?.date,label:'← '+(other?.name||'—'),amount,kind:'transfer'});
      }
    });
    return rows.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  }

  function openingBalanceChange(accountId, nextOpeningBalance, accounts, ledger) {
    if (!global.MongoLedgerCore) throw new Error('MongoLedgerCore is required before MongoAccounts');
    const list = Array.isArray(accounts) ? accounts : [];
    const account = list.find(a => String(a?.id) === String(accountId));
    if (!account) return null;
    const before = Math.max(0, Math.round(Number(account.openingBalance) || 0));
    const after = Math.max(0, Math.round(Number(nextOpeningBalance) || 0));
    const current = Math.round(global.MongoLedgerCore.accountBalance(account.id, list, ledger || []));
    return { before, after, delta:after-before, current, result:current+(after-before), changed:after!==before };
  }

  function canDeactivate(accountId, accounts, ledger, tolerance = 0.001) {
    if (!global.MongoLedgerCore) throw new Error('MongoLedgerCore is required before MongoAccounts');
    return Math.abs(global.MongoLedgerCore.accountBalance(accountId, accounts || [], ledger || [])) <= tolerance;
  }

  function deactivateMetadata(accountId, accounts, ledger, tolerance = 0.001) {
    const list = Array.isArray(accounts) ? accounts : [];
    const account = list.find(a => String(a?.id) === String(accountId));
    if (!account) return {ok:false, reason:'not_found'};
    if (!canDeactivate(accountId, list, ledger, tolerance)) return {ok:false, reason:'non_zero_balance'};
    account.active = false;
    return {ok:true, account};
  }

  global.MongoAccounts = Object.freeze({ normalizeType,isActive,isSpendable,isSavings,cleanName,cleanDate,defaultAccountId,openingTotal,earliestTransactionDate,makeLegacyAccount,normalizeMetadata,ensureLegacyAccount,assignMissingTransactionAccounts,makeAccount,editMetadata,accountTotal,transferRows,openingBalanceChange,canDeactivate,deactivateMetadata });
})(window);
