# Weru 97 Paint Toolbox and Drawing Pass (2026-09-24)

## Source finding

`Stitch Designs/html/windows_97_paint.html` defines a left toolbox measuring 56px wide, arranged as two columns by eight rows, followed by a vertical four-choice line-width well. The active React app had drifted to an 8×2 horizontal tool strip and omitted the size well. The task ledger and manifest had incorrectly described the comparison as visually verified; the manifest status is corrected to partial until a matched viewport is captured.

## Implementation

- Rebuilt the tool strip as the source-oriented left toolbox and restored the four selectable 1–4px size options.
- Added pointer-position coordinates to the Paint status bar, including the source reset position after the pointer leaves.
- Replaced point-stamping freehand behavior with continuous size-aware pencil and round brush strokes, plus a continuous eraser.
- Implemented color sampling from the drawing layer or an image asset when browser origin rules permit, the zoom tool, and basic line, curve, rectangle, polygon, ellipse, and rounded-rectangle strokes with pointer previews.
- Preserved the 580×340 drawing surface, Stitch cyber-engine artwork, 28-color palette, and media-image layer.
- Added server-render regressions for the left toolbox contract, 4 sizes, live-coordinate slot, palette accessibility, and image/canvas dimensions.

## Verification

- Focused Paint render tests: 1 file, 3 tests passed.
- Full project suite after the Paint addition and shape-geometry coverage: 44 files, 180 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; the existing stale Browserslist database warning remains.
- `git diff --check`: passed with existing LF-to-CRLF normalization warnings.

## Remaining work

- Freeform/rectangular selection and text insertion are not yet implemented.
- The tool event behavior needs browser interaction tests, and the source/app screenshots need matched-viewport comparison before declaring visual parity.
- Do not upgrade the Stitch manifest's visual or functionality status based on the server-render checks alone.
