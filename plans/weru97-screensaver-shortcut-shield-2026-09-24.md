# Weru 97 Screensaver Shortcut Shield

## Finding

The screensaver overlay sat above the desktop, and the app-level desktop shortcuts were already suppressed while it was active. However, `WindowManager97` independently installed a global Ctrl/Cmd+W and Ctrl/Cmd+M listener, so those keys could still close or minimize the focused window beneath the overlay.

## Change

- Added `keyboardShortcutsEnabled` to `WindowManager97Props`, defaulting to `true` to preserve normal window behavior.
- Passed `!screensaver` from `App.tsx` so the window-manager listener is removed while the screensaver is active.
- Added a defensive `shortcutsEnabled` guard to the shared shortcut policy.
- Added regression coverage for both W and M: disabled shortcuts return unhandled without preventing the browser event, prompting, closing, or minimizing.

## 2026-09-25 follow-up audit

- A second close route was still present in `Window97.onKeyDownCapture`: it closed the focused window directly and did not receive `keyboardShortcutsEnabled`. This meant the existing manager-level guard was insufficient when focus remained inside a window beneath the screensaver.
- Threaded the same enable flag from `WindowManager97` into every `Window97` and gated the local Ctrl/Cmd+W capture through a shared pure predicate. The manager and focused-window handlers now agree when overlays disable shortcuts.
- Focused checks: 2 files / 9 tests pass. Full suite: 64 files / 245 tests; TypeScript, repository lint, and `npm run build -- --webpack` pass. Build reports the existing stale Browserslist-data notice.
- The Escape-to-exit screensaver interaction still requires live browser verification; no localhost or browser window was started for this follow-up.

## Verification and remaining evidence

- `npx vitest run src/wm/window-close97.test.ts src/wm/Window97.test.ts` — 2 test files passed, 8 tests passed.
- Repository gates after the change: `npx tsc --noEmit` passed; `npm run lint` passed; `npm test -- --run` passed (31 files, 129 tests); `npm run build` exited 0. Build reports the existing stale Browserslist database notice.
- Live Escape-to-exit behavior and preservation of the underlying window still require a browser interaction check; that broader Phase 3 item remains partial.
- Localhost was not started for this change.
