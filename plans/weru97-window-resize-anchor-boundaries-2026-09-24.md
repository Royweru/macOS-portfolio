# Weru 97 Window Resize Anchor and Boundary Fix (2026-09-24)

## Goal

Make all eight resize handles preserve their intended fixed edge, including when north/west resizing reaches the desktop origin, while retaining minimum dimensions and the viewport clamp managed by `WindowManager97`.

## Finding

The existing west/north math computed a larger width/height when the pointer moved beyond the stage origin, then the manager clamped only `x`/`y`. That could move the opposite edge during a resize that should have kept it fixed. The resulting rectangle stayed within bounds, but the gesture did not match normal window-manager behavior.

## Change

- Extracted `resizeRectFromPointer97()` into `src/wm/useResize97.ts` and used it in the pointer hook.
- Bound westward/northward pointer deltas by the current origin and minimum size before computing the rectangle.
- Kept east/south stage-edge clamping in the existing manager layer.
- Added tests for all eight handles, north/west origin limits, and minimum-size anchoring.

## Verification

- Focused resize/window geometry tests: 3 files, 18 tests passed.
- Full test suite: 43 files, 171 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; existing stale Browserslist data warning remains.

## Still outstanding

This fixes and tests pointer geometry but does not complete the Chapter 2 live interaction matrix. Each active app still needs real browser pointer/touch verification; no localhost server was started for this slice.
