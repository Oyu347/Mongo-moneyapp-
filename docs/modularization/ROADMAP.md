# Möngö Modularization Roadmap

## Migration order

1. Storage
2. Core
3. Accounts
4. Transactions
5. Loans
6. Savings
7. Assets
8. Budget
9. Cloud
10. Audit
11. i18n
12. Web
13. Mobile

This order follows dependencies rather than menu order.

## Phase approach

For every module:

1. Inspect the latest working `index.html` and identify ownership/dependencies.
2. Create a compatibility module without changing financial behavior.
3. Link the module before migrating callers.
4. Move only a small, clearly bounded set of callers.
5. Run syntax and regression checks.
6. Compare critical financial results before/after.
7. Commit the completed phase separately.
8. Update `PROGRESS.md` before starting the next phase.
9. Remove legacy duplicate code only after the replacement is proven stable.

## Current sequence

Storage Phase 1 → Core / unified ledger → Accounts → Transactions.

Do not jump ahead merely because code is nearby in `index.html`. Preserve dependency order and working behavior.