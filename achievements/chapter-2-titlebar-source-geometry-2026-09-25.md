# Chapter 2 — Source-Specific Titlebar Geometry — 2026-09-25

## Delivered

- Replaced the implicit one-size titlebar assumption with source-scoped 18px rules for the Stitch-authored Explorer, Notepad, Paint, Calculator, Minesweeper, CD, and system-dialog windows.
- Kept 20px geometry for desktop, IE4, and Media Player references.
- Restored the inactive Explorer titlebar's gray gradient and black label color.
- Added a test mapping raw Stitch source dimensions to each affected registered app ID.

## Verification

- Focused source mapping: 19 assertions passed.
- Full test, lint, typecheck, and build results are recorded after the implementation run.
- Exact screenshot comparison and physical window interaction remain open.
