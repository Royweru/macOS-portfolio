# Chapter 2 — Screensaver Motion and Lifecycle (2026-09-24)

## Delivered

- Screensaver now respects both Weru's reduced-motion setting and the browser's reduced-motion preference.
- Reduced-motion mode draws one static starfield frame without scheduling an animation loop.
- A stable parent exit callback prevents unrelated app renders from restarting the canvas and regenerating the field.
- Mouse, pointer, and keyboard exit listeners remain in place.
- Added `plans/weru97-screensaver-reduced-motion-2026-09-24.md` and updated the Chapter 2 tracker and evidence index.

## Verification

- TypeScript, lint, full Vitest suite, production build, and `git diff --check` were run after this implementation; the Chapter 2 tracker records their latest totals.

## Still open

- Manually verify static motion preference, Escape exit, pointer exit, and that the underlying focused window remains open.
- This pass leaves localhost stopped, so no live claim is made.
