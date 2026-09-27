# Chapter 2 — Paint Selection, Fill, and Text Tools (2026-09-24)

## Delivered

- Completed the previously inactive Stitch toolbox tools for rectangular/free-form selection, selection movement, Delete/Escape, and internal copy/cut/paste.
- Added multiline text placement with explicit OK/Cancel and selected-color rendering.
- Replaced whole-canvas fill with a connected-region bucket fill; opened images are proportionally copied into the editable canvas so paint operations affect the displayed pixels.
- Added safe failure feedback for image operations blocked by browser origin rules.
- Removed the non-Stitch System Memo overlay and restored the blueprint grid's 15% opacity; the memo now appears only as part of the source artwork's existing note.
- Kept the Paint source manifest `visualStatus` and `functionalityStatus` at `partial`; this work does not substitute automated geometry tests for live interaction or matched-viewport visual proof.

## Verification

- `src/apps/paint/Paint97.test.ts`: 12 tests pass, including source-overlay parity, shape geometry, image-fit geometry, selection bounds, and flood-fill connectivity.
- Full suite: 44 test files / 183 tests pass.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- Localhost remains stopped; no live browser test was run.

## Remaining

- Live pointer/clipboard/text workflow acceptance and matched-viewport Stitch comparison remain open. See `plans/weru97-paint-selection-text-2026-09-24.md`.
