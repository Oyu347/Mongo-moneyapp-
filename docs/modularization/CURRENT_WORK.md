# Möngö Current Work

Updated: 2026-09-26
Branch: `development-modular`

## Current PHONE baseline
`Mongo-PHONE-TEST-SAVINGS-INTEREST-I18N-SAFE-V36.html`

V36 is the last user-confirmed phone baseline. Do not continue from V37: V37 is discarded because Transactions already shows older year/month groups when the filter is `Бүгд / All`.

## Preserve — already PHONE PASS
- Cloud serialization/restore safety and financial consistency checks.
- Cancelled savings accounts close at ₮0; legacy `Ком` -₮200,000 regression is fixed.
- Closed savings accounts do not show Terminate deposit / Interest income actions.
- Real cancellation keeps principal transfer, interest adjustment/clawback and bank fee accounting separate; no duplicate cash effect.
- `bank_expense` internal key displays as localized Bank expense and fee actuals flow to budget.
- Linked savings goal archives when its savings account is cancelled, with cancellation-specific archive reason rather than “goal achieved”.
- Savings Interest income action prefills calculated interest and allows user correction to actual bank credited amount before saving.
- Savings action buttons + Interest income modal have 7-language render-time i18n (mn/en/zh/ja/ko/ru/de), without whole-document MutationObserver translation.
- Transactions keeps year → month collapsible history; older entries appear under `Бүгд / All`.

## Next exact work
Continue from V36 only. Validate the remaining real savings cancellation scenarios without changing already-passed accounting/i18n behavior. After that, return to Savings → early-termination calculator: its Rule 2 “Үе шаттай хүү бодох” shell is visible but staged-condition fields are missing and must be restored.

## Working rule
One bounded change → Android phone test → PHONE PASS → only then promote the baseline. Failed patches are discarded/cleaned rather than stacked. Every new file must regression-check the preserved items above.
