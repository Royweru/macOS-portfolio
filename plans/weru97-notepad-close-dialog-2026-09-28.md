# Weru 97 Notepad Close Dialog — 2026-09-28

## Goal

Replace the browser-native `window.confirm` used when closing a dirty Notepad window with an accessible, classic Win97 modal. Apply the same policy to title-bar X, the title context menu, and Ctrl/Cmd+W.

## Implementation

- Added `getWindowCloseAction97()` to keep the close/confirm/block decision pure and shared.
- Added `UnsavedChangesDialog97` with a classic blue title strip, bevels, safe Cancel focus, Escape cancellation, and explicit “Close Without Saving” / “Cancel” actions.
- Routed `Window97` close requests and `WindowManager97` Ctrl/Cmd+W through the same pending-close dialog state.
- Added in-shell modal styling; no native browser prompt remains on these paths.
- Updated focused tests for close policy, keyboard dispatch, window controls, and dialog accessibility.
- Fixed pointer-down bubbling on the title context menu: the parent window previously unmounted the menu before the Close item click fired.

## Browser verification

Used one Chrome-extension tab at `http://localhost:3001/`; skipped the splash to reach the persisted local profile.

- Edited `skills-used.txt` only in memory and confirmed `Modified` / `*` state.
- Title-bar X opened `Confirm Close — skills-used.txt`.
- Cancel removed the dialog while keeping the dirty editor open.
- Reopening the prompt and selecting “Close Without Saving” closed the window.
- A dirty title-context-menu Close initially only dismissed the menu. After the propagation fix, it opened the same in-shell confirmation; Cancel left the editor dirty.
- Reopened the same file from Adventures Explorer and confirmed the persisted original text (`Next.js`, `Prisma`, `tRPC`, `PostgreSQL`) was intact.
- Repeated with Ctrl+W; it opened the same dialog and Discard closed the editor. The Skills file was reopened afterward. No text was saved and no user-owned X, WhatsApp, or Stitch tabs were touched.

## Verification

- Focused Vitest before the final pointer propagation regression: 3 files / 42 tests passed.
- Final full Vitest suite: 71 files / 347 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed all 222 TypeScript files in 28 batches.
- `npm run build`: passed; Next reported only the existing stale Browserslist data notice.
- `git diff --check`: passed with existing LF-to-CRLF working-copy notices.
- Save/Save As, Find, clipboard, and complete per-app window-control matrix remain unverified.

## Current status

All three dirty-close entry points now reach the custom dialog and both Cancel/Discard outcomes have been verified. The wider Chapter 2 Notepad workflow remains partial until Save/Save As, Find, and clipboard behavior are verified.
