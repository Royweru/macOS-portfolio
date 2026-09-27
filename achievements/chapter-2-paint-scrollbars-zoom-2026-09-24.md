# Chapter 2 — Paint Scrollbars and Scaled Artboard (2026-09-24)

## Delivered

- Replaced native-only canvas scrolling with Stitch-shaped classic horizontal and vertical bars.
- Added pointer-captured thumb drag, arrow/page navigation, keyboard controls, accessible scrollbar semantics, and viewport synchronization.
- Fixed zoom-out by scaling a fixed-size Paint surface inside a correctly sized layout frame, preserving the drawing layer's logical 580×340 pixel coordinates.
- Kept live pointer and matched-viewport claims open; this is an implementation-and-automated-test record, not visual parity sign-off.

## Verification

- Paint-focused tests: 15 passed.
- Full suite: 46 test files / 186 tests passed.
- TypeScript, lint, and production build passed; build retains the stale Browserslist database warning.
- Localhost was not started.

## Remaining

- Live pointer/keyboard acceptance and matched-size Stitch comparison are still required. See `plans/weru97-paint-scrollbars-zoom-2026-09-24.md`.

