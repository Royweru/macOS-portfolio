# Chapter 2 Achievement — Screensaver Motion and Exit Regression

**Date:** 2026-09-28  
**Status:** Automated behavior verified; live overlay acceptance remains partial.

## Delivered

- Isolated starfield motion so reduced-motion mode produces a stable frame and normal mode advances/respawns stars predictably.
- Made pointer, mouse, and keyboard exit listeners one-shot as a group, with explicit cleanup on exit or unmount.
- Connected the helpers to `Screensaver97` and avoided the Windows case-insensitive filename collision with the component filename.
- Updated the Chapter 2 tracker and added a focused plan.

## Evidence

- Focused screensaver tests: 4/4 passed.
- Full test suite: 72 files / 356 tests passed.
- TypeScript passed; lint passed all 224 TypeScript files; production build passed with the existing stale Browserslist-data notice; `git diff --check` passed with line-ending notices only.

## Still open

The current worktree was loaded in the browser extension, but that extension disconnected during the configured idle wait; after reconnect the desktop was visible, making activation inconclusive. No Escape-over-overlay or rendered reduced-motion behavior was confirmed live. Touch, full boot flow, and wider Stitch parity remain partial.

See `plans/weru97-screensaver-motion-and-exit-regression-2026-09-28.md`.
