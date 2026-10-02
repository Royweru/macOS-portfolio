# Paint Rounded Rectangle Compatibility — 2026-09-28

Added a quadratic-curve fallback for browsers without `CanvasRenderingContext2D.roundRect()`, clamping the corner radius to the drawn shape. Regression coverage verifies the native path and the rounded fallback; it prevents the unsupported API case from silently drawing a square rectangle.

Verification: 18 focused Paint tests; full suite 71 files / 351 tests; TypeScript, lint (222 files), and production build passed. The browser extension detached during an unrelated AfyaTrack playback attempt, so rounded-rectangle pointer interaction and Stitch appearance remain unverified. See `plans/weru97-paint-rounded-rectangle-canvas-fallback-2026-09-28.md`.
