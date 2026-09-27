# Weru 97 — Touch Resize Pointer Safety (2026-09-24)

## Finding

The title-bar drag surface already disabled browser touch gestures, but the eight resize handles did not. A browser could interpret a touch resize as page pan/zoom and cancel the pointer stream despite `setPointerCapture`.

## Change

- Set `touch-action: none` and `user-select: none` on every resize handle in the shared `Window97` frame.
- Apply `touch-action: none` directly to the drag surface as well as its shared CSS rule.
- Keep pointer capture, direction-specific cursors, and existing mouse behavior unchanged.

## Verification boundary

- Render tests cover all eight resize directions, touch-action markup, and the absence of resize handles while maximized.
- `npx tsc --noEmit`, `npm run lint`, the full test suite (31 files / 128 tests), and `npm run build` all passed. The build emitted only the existing stale Browserslist-data notice.
- A real touch-device gesture pass remains open, as does the Phase 3 all-app interaction matrix.
