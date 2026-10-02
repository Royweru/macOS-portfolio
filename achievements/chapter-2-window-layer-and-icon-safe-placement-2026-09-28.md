# Window Layer and Shortcut-Safe Placement — 2026-09-28

Fixed the maximized-window shell layer so the taskbar remains visible, and added a shared first-open placement guard that keeps new windows clear of the desktop shortcut columns where viewport width permits. Wide-screen Stitch window sizes are preserved; narrow screens reduce width only when required to keep a usable shortcut rail. Existing saved window positions are not rewritten.

Live browser-extension verification at localhost:3001 (1422×702) covered My Computer Explorer placement, maximize with taskbar visible after reload, context-menu restore, minimize/taskbar restore, title-bar drag, southeast resize, and X close. Outlook Express opened clear of its shortcut and closed without sending. The temporary windows were removed and the dev server was stopped. User-owned browser tabs were untouched.

Validation: TypeScript passed; Vitest passed 71 files / 349 tests; lint passed for all 222 TypeScript files; production build passed with the existing stale Browserslist/caniuse-lite notice; `git diff --check` passed. The temporary server is stopped. The wider all-app matrix and matched-viewport Stitch fidelity remain partial.
