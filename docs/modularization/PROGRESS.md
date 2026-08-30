# Möngö Modularization Progress

Read `ARCHITECTURE.md`, `ROADMAP.md`, `RULES.md`, and this file before continuing.

## Branch
`development-modular` — never use `main` for modularization work.

## Completed
Storage Phase 1; Core Phase 1 COMPLETE; Accounts Phase 1 COMPLETE; Transactions Phase 1 COMPLETE; Loans Phase 1 COMPLETE; Savings Phase 1 COMPLETE; Assets Phase 1 COMPLETE; Budget Phase 1 COMPLETE.

### Budget Phase 1 closure
- 1A module `fbe83463ee53f97fbed1e39eb44dc50b51da5558`; tests `d3def27de72eeead47627d98fa7423af7a9af8c4`.
- 1B module `7787ee7607c9c9f4943066c71186e94d1ebeac2f`; tests `ca0e38835e0af5947b6887b1c48196d0cc032743`.
- 1C module `bb2df36588c2189334cbcf63d529e28abc14f026`; tests `f9e2308488016af0ded4f9bbb4f90f12faf6ac40`.
- 1D module `82beb6f85e5469a53e2efda764914c2babc0b0bf`; tests `91d7790f9f9e46ec9567b845cdfb350486dc98a7`.
- 1E closure marker `c446bdd3534e0e981db728d600d0c8ce613a2551`.

### Budget — Phase 1E closure audit
- Prepared `index.modular-budget-phase1e.html` is audit-only and preserves Phase 1D behavior.
- Savings goal Budget actual is Savings Transfers plus credited savings interest; ordinary Savings Expense is not added again in the linked-goal path.
- Loan Budget actual uses total monthly cash payment; principal/interest semantics remain owned by Loans.
- Investment Budget actual counts only eligible `investment`/`asset` purpose rows after source identity resolution; internal Transfers do not count.
- Plan-vs-actual health thresholds remain unchanged.
- Auto-import source identity is ID-backed (`goal_`, `debt_`, `invest_`) so duplicate display names can coexist.
- Current/future seeding never overwrites an existing monthly Budget property, including an explicit zero entered by the user.
- Legacy same-name migration copies only into missing destination keys; existing destination values win and legacy values remain available during compatibility migration.
- Loan-funded/linked-debt investments remain excluded from recurring Investment Budget sources.
- Category/subcategory array mutation, persistence, UI and localization remain compatibility boundaries.
- Static syntax validation executed: 44 non-empty inline JavaScript blocks, 0 syntax errors.
- Node Budget regression suite and browser/runtime parity are not recorded as executed.

## Current state
Budget Phase 1 is closed. Pure keys, month matching, progress classification, Transfer-backed actuals, source identity/eligibility, seed guards and legacy migration planning are modularized.

## NEXT STEP
### Cloud — Phase 1A: cloud/local ordering and queue foundation
1. Inspect exact Firebase/cloud save, load, pending queue, revision/timestamp and clear/reset flows in the latest prepared HTML.
2. Extract only pure ordering/conflict-decision helpers to `src/services/cloud/cloud.js`.
3. Preserve rule: stale cloud state must never overwrite newer valid local state.
4. Preserve rule: clear/reset must not allow queued stale writes to resurrect deleted state.
5. Keep Firebase SDK calls, auth listeners, UI indicators and persistence side effects inline initially.
6. Add focused cloud conflict/queue regression tests and static syntax validation.

## Future order
Cloud → Audit → i18n → Web → Mobile.

## Handoff rule
At each phase end record exact commits, tests actually performed, unresolved risks and exact next step.
