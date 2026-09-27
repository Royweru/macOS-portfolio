# Chapter 2 — IE4 Page Printing (2026-09-24)

## Delivered

- Replaced IE4's inert “Print unavailable” toolbar action with native browser printing.
- Prints a detached copy of the current IE page only. The desktop, OS windows, taskbar, and browser toolbar are excluded by print-only CSS.
- Starts printing directly in the toolbar click handler and cleans up the temporary page after `afterprint` or when the IE window unmounts.
- Added focused helper and render tests; localhost was not started.

## Verification

- IE print-surface and render tests: 2 files, 7 tests passed.
- Full suite: 34 test files, 137 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; the existing stale Browserslist database notice remains.
- `git diff --check` reported no whitespace errors; only existing CRLF normalization warnings.

## Still open

- Open the native print preview in a browser and confirm only the IE page appears and the temporary surface is removed after cancel/print.
- IE4 matched-viewport visual comparison against the Stitch HTML remains open.
