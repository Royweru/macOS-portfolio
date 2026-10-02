# Paint Rounded Rectangle Canvas Fallback — 2026-09-28

## Goal

Keep the Paint Rounded Rectangle tool rounded in browser implementations that do not provide `CanvasRenderingContext2D.roundRect()`.

## Change

- `drawShape97()` now computes a corner radius bounded by the drawn width and height.
- When native `roundRect()` exists, the helper uses it with the bounded radius.
- Otherwise, the helper constructs the same four-corner outline with quadratic curves and closes the path. The unsupported-browser path no longer falls through to `rect()`.

## Verification

- Focused Paint tests: 18 passed.
- Full suite: 71 files / 351 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed all 222 TypeScript files.
- `npm run build`: passed; only the existing stale Browserslist database notice appeared.
- The browser extension detached during a separate AfyaTrack playback attempt, so this Rounded Rectangle change was not live-tested. No visual parity claim is made.

## Remaining

Live pointer interaction, rounded-corner appearance against the Stitch source, the Paint Curve tool, image import, and pixel accuracy on imported images remain open in `plans/weru97-chapter-2-task-list.md`.
