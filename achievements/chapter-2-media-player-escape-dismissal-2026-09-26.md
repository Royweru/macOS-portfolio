# Chapter 2 — Media Player Escape Dismissal (2026-09-26)

## Completed

- Fixed the Open Media library overlay so Escape dismisses it consistently with the Media Player's URL and Properties overlays.
- Added a focused source-contract regression for menu/library/URL/Properties dismissal.

## Verification

- The focused Media Player suite passes (8 tests); the full suite passes (68 files / 319 tests), TypeScript and the changed-file ESLint pass, and the production build passes (with only the existing stale Browserslist data notice).
- Full Media Player keyboard interaction and visual Stitch comparison remain open.
