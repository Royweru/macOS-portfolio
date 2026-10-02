# Weru 97 Desktop Shortcut Enter Live Smoke — 2026-09-28

## Scope

Verify that a keyboard-focused desktop shortcut opens through the same route as a double-click, without opening another browser tab or sending any message.

## Result

- Reused the existing Chrome-extension tab on `localhost:3001`, loaded the current worktree, and skipped the boot screen.
- Focused the desktop `Outlook Express` shortcut and pressed Enter.
- Exactly one `Outlook Express - New Message` window appeared, with the expected compose fields and recipient. The Send action was not invoked.
- Clicked the window's title-bar X; the compose window and its taskbar button disappeared from the live accessibility tree.
- Stopped the temporary dev server and verified port 3001 had no listener.

The implementation is in `src/shell/Desktop97.tsx` and `src/shell/desktop-layout97.ts`; the helper regression is in `src/shell/desktop-layout97.test.ts`. This verifies one shortcut and its close control, not the complete keyboard/window matrix or visual-focus parity.
