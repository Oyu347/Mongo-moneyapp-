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

## Active phone-work sequence — 2026-09-26

Current baseline: `Mongo-PHONE-TEST-SAVINGS-INTEREST-I18N-SAFE-V36.html` (PHONE PASS). V37 is discarded.

Next work:
1. Continue savings/real-cancellation validation from V36 one bounded change at a time.
2. Preserve the interest-income prefill + user correction flow; later decide/implement scheduled automatic interest posting separately.
3. Return to Savings → early-termination calculator and restore the missing Rule 2 staged-condition UI only after the real-account flow remains stable.
4. Keep 7-language coverage in every new savings/account UI change.
5. Before promoting any new baseline, regression-check Cloud safety, closed-account ₮0 state/actions, cancellation accounting, linked-goal archive, bank-expense budget mapping, savings i18n, interest prefill, and Transactions year/month grouping under All.

Do not revive discarded V37 or failed V31/V32-style migration/diagnostic patches. Port only proven behavior from the last PHONE-PASS baseline.

