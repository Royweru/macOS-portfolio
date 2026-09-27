# Weru 97 Notepad Menu Command Parity — 2026-09-25

## Problem found

The classic menu labels were rendered as direct actions instead of menus: File immediately attempted Save, Edit incorrectly opened Save As, Search opened the Find dialog, and Help did nothing. This made the UI misleading and left common editing commands inaccessible from the menus.

## Implementation

- Added classic File, Edit, Search, and Help pop-up menus at the retained Stitch 18px menu-bar height.
- File now exposes Save and Save As with clean/read-only/save-parent capability checks.
- Save As suggests a `.md` copy name for Markdown files and waits for linked content to load before enabling the command.
- Edit exposes Undo (honestly disabled because undo history is not implemented), Cut, Copy, Paste, and Select All. Clipboard read/write errors remain in the Notepad status bar; Cut/Paste are disabled for read-only files.
- Search exposes Find and Find Next. Search is case-insensitive, starts after the current selection/caret, wraps once, selects a source-text match, and updates the line status.
- Help opens a dismissible classic Notepad Help dialog.
- Keyboard behavior opens a menu with Arrow Down, moves across top-level menus with Arrow Left/Right, moves through enabled items with Arrow Up/Down, supports Home/End, and closes with Escape while restoring trigger focus.
- Added tests for menu command placement/availability, read-only policies, wrapped search, focus-index navigation, and rendered menu labels.

## Verification and remaining work

- Focused Notepad menu/content/caret tests pass (3 files, 11 tests).
- TypeScript validation passes. ESLint reports no errors; CSS is not linted by the configured ESLint rules.
- Live click/keyboard/clipboard checks and a current-build browser workflow remain open because the published site is stale and localhost is intentionally stopped.
- The task-list item remains partial until those interactions are verified.
