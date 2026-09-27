# Weru 97 Outlook/Games Position Migration — 2026-09-25

## Defect hardening

The known Outlook/Games collision was originally repaired for v19 persisted profiles under state version 20. The current worktree already writes version 20, so profiles saved at that version would not execute a newly added version-20 migration. Bump the store schema to 21 and replay only the exact generated Outlook coordinate `(104,12)` so already-upgraded profiles can self-repair.

## Changes

- Bumped the OS persisted-state version from 20 to 21.
- Re-ran the narrow Outlook coordinate migration for v20 state, while preserving all nonmatching/custom coordinates.
- Expanded the migration regression to cover v20 legacy state and a user-positioned Outlook shortcut.
- Added pairwise no-overlap checks for all built-in icons at 596px, 722px, and 912px work-area heights. The reported 596px layout explicitly asserts Games at row 1, Recycle Bin at row 2, and Outlook Express at row 3 in column two.
- Updated the Chapter 2 task ledger and desktop layout record.

## Verification

- Focused regressions passed: `os-store.test.ts`, `desktop-shortcut-source97.test.ts`, and `desktop-layout97.test.ts` (48 tests total).
- Live check was not repeated: the available browser inventory did not contain a Weru page, and localhost was not started.
- Full suite passed: 62 files / 240 tests. TypeScript and lint passed.
- `npm run build -- --webpack` passed. The configured default Turbopack build failed with OS error 112 while writing a `.next` map due to low free disk space; generated output was not deleted. Both builds report the existing stale Browserslist-data warning.
- `git diff --check` passed with Git's existing LF-to-CRLF notices.
