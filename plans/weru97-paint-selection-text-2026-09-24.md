# Weru 97 Paint Selection, Clipboard, Fill, and Text Tools (2026-09-24)

## Scope

Continue the Paint implementation against Stitch screen `85ab0677c7404c0d93c0d97b45252680` and close the remaining functional gap called out in the earlier [toolbox/drawing pass](weru97-paint-toolbox-and-drawing-2026-09-24.md). Keep the vertical 2×8 toolbox and 580×340 working surface. Do not claim full Paint parity without matched-size source comparison and live pointer acceptance.

## Implementation

- Import opened images into the canvas using proportional `object-fit: contain` geometry so drawing, sampling, bucket fill, and selections operate on the same pixels the user sees. Cross-origin pixel reads fail safely with an explicit status message rather than silently damaging the image.
- Implement rectangular and free-form marquee selection, masked floating pixels, bounded dragging, Escape-to-place, Delete/Backspace removal, and in-app Ctrl/Cmd+C/X/V selection clipboard handling.
- Implement the Text tool as a positioned multiline editor with explicit OK/Cancel; OK paints text into the canvas using the selected palette color.
- Replace the previous whole-canvas color wash with a tested four-connected exact-color bucket fill.
- Keep the source artwork beneath the transparent drawing layer for the default no-file view, and preserve source-specific toolbox and palette geometry.
- Remove the separate React “System Memo” overlay that did not exist in the source; keep the real source note inside the artboard and reduce the blueprint dots to the Stitch layer's 15% opacity.

## Verification

- Focused Paint test file: 12/12 tests pass, covering rendered source layout, source-note/overlay parity, image/canvas sizing, proportional image fit, free-form bounds, six shape tools, and connected-region flood fill.
- Full project suite: 44 test files / 183 tests pass.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- No local server was started and no browser interaction was claimed.

## Still required

- Exercise pointer selection, freehand outline, drag, Escape, Delete, copy/cut/paste, text entry, and fill against the supplied picture in a real browser.
- Compare the full Paint window at the same viewport as the Stitch source; the manifest must remain partial until this is done.
- Test with an image that cannot be read because of browser origin restrictions and confirm the safe error path.
