# Weru 97 Notepad Save As Window Binding — 2026-09-27

## Issue

Save As created a new VFS file but left the current Notepad window bound to the source file. The caption therefore stayed on the old filename, and subsequent edits/saves still targeted the old node. That behaves like “Save a Copy,” not normal Notepad “Save As.”

## Change

- Added an OS-store action to retarget a window to a new document ID and caption, clearing the saved window's read-only flag.
- Limited the action to windows whose content is the Notepad editor: Notepad, About, Skills, and Experience.
- Wired the editor's Save As completion callback through the existing window content host. On success, the same window follows the new file; if a standalone editor has no rebinding callback, it retains the truthful “Saved copy” behavior and does not falsely clear the dirty state.
- Kept the source file unchanged and kept the new copy in the source file's parent directory.

## Verification

- Store tests verify rebinding a read-only Notepad window, a Notepad-backed About window, and rejection for Explorer.
- Focused Notepad/store/wallpaper suite: 3 files / 53 tests passed.
- Full suite: 69 files / 336 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed for all 217 TypeScript files.
- `npm.cmd run build`: passed; Next.js emitted only the existing stale Browserslist data notice.
- No browser end-to-end Save As workflow was run; the Chapter 2 Notepad interaction item remains partial.
