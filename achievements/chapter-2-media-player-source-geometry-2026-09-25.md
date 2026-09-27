# Chapter 2 — Media Player Source Geometry Re-audit (2026-09-25)

## Delivered

- Measured the retained Stitch Media Player window in Chromium: 640×396 at (80,56), rather than the prior 640×520 estimate.
- Corrected the active default and narrowly migrated only pre-v22 saved Media Player rectangles that matched the obsolete 640×520 default; custom sizes remain untouched.
- Added source-bound and migration tests.

## Evidence

- Focused tests: 4 files, 54 passed.
- TypeScript: `npx tsc --noEmit` passed.
- This slice changed the outer rectangle but did not yet fix the inner-row overflow found in the subsequent local browser check. The 2026-09-26 achievement records that follow-up; neither record claims full Media Player parity.

See `plans/weru97-media-player-source-geometry-correction-2026-09-25.md`.
