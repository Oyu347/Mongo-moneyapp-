# Möngö Mobile shell boundary — Phase 1B

The current application remains web-first. This directory must not duplicate financial, Cloud, storage, auth or UI policy.

## Current HTML findings
- No direct Capacitor/Cordova integration.
- Viewport is `width=device-width, initial-scale=1.0`; `viewport-fit=cover` is not currently enabled.
- Existing CSS already uses `env(safe-area-inset-top/bottom)` in five places. Do not globally enable `viewport-fit=cover` until the whole fixed-header/footer/modal surface is reviewed on real iOS/Android WebViews.
- Existing select UX has deliberate touch/pointer interception and Android-specific comments. Preserve it until native WebView testing proves a concrete incompatibility.
- Backup restore uses an HTML file input. Backup export remains Web download behavior. Native Filesystem/Share adapters are future shell decisions, not Phase 1B changes.
- No History API/popstate/native-back integration exists in the inspected HTML.

## Capacitor shell requirements to validate before implementation
1. App lifecycle/resume: adapt only when a concrete feature needs native lifecycle beyond existing pageshow/visibility behavior.
2. Deep links: define approved app/payment/auth URL schemes before adding an App plugin listener.
3. Keyboard: test transaction/account forms and bottom sheets first; add Keyboard plugin policy only for observed WebView issues.
4. Status bar/safe area: test full-screen/notch devices before enabling edge-to-edge or `viewport-fit=cover`.
5. Native back: define modal/tab/exit precedence before intercepting Android back.
6. File/share: decide whether JSON backup export/import should remain WebView download/file input or use native Filesystem/Share.

## Non-goals
No plugin is added merely because Capacitor supports it. Mobile adapters must remain platform plumbing; financial and Cloud semantics stay in their existing modules.
