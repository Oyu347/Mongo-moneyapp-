# Möngö Modular Architecture

This folder is the source of truth for the modularization of Möngö — Money Flow System.

## Target structure

```text
src/
├── core/
│   ├── ledger.js
│   ├── calculations.js
│   ├── validation.js
│   └── money.js
├── features/
│   ├── accounts/
│   ├── transactions/
│   ├── budget/
│   ├── savings/
│   ├── loans/
│   └── assets/
├── services/
│   ├── storage/
│   └── cloud/
├── audit/
├── i18n/
├── web/
└── mobile/
```

## Responsibilities

| Area | Responsibility |
|---|---|
| core | Unified money ledger, shared calculations and validation |
| accounts | Accounts, opening balances, account history |
| transactions | Income, expense and transfer flows |
| budget | Budget, subcategories and performance |
| savings | Savings, goals and savings-account links |
| loans | Loans, repayments, principal and interest |
| assets | Assets and asset income |
| services/storage | Local persistence compatibility layer |
| services/cloud | Firebase persistence, synchronization, restore and clearing |
| audit | Cross-feature financial consistency checks |
| i18n | Seven-language strings and locale behavior |
| web | Web-specific bootstrap and hosting integration |
| mobile | Capacitor and Android/iOS-specific integration |

## Architecture principle

Business/financial logic, persistence services, and platform/UI concerns should remain separated. Feature modules may depend on `core`, but `core` must not depend on feature UI. Firebase/cloud is a service, not a financial feature.

## Financial source of truth

The long-term goal is for balances and financial relationships to be derived from the unified ledger rather than duplicated independent totals. Migration must be incremental so existing working behavior is preserved while callers move to the modular APIs.