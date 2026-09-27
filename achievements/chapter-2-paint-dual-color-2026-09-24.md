# Chapter 2 — Paint Dual-Color Behavior (2026-09-24)

## Delivered

- Implemented separate foreground and background paint colors in the Stitch-authored palette wells.
- Left-click palette selection changes the foreground; right-click changes the background. Right-button drawing/fill and the color picker use the secondary color.
- Changed the eraser from transparent deletion to painting with the selected background color, matching classic Paint semantics.
- Text placement keeps the foreground/background color selected when the text tool was activated.
- Added a source-backed regression comparing all 28 rendered swatches, in order, to the raw Stitch HTML and asserting the Stitch 2×14 column flow in CSS.
- Kept the existing 580×340 sheet, swatch grid, toolbox, and drawing controls unchanged.

## Verification

- Paint-focused suite: 14 tests passed, including the exact ordered 28-swatch source comparison and left/right color/tool mapping.
- Full suite: 46 test files / 188 tests passed; TypeScript and lint passed.
- Production build passed with the existing stale Browserslist-data warning; `git diff --check` passed with only repository line-ending notices.
- Live pointer behavior and matched-viewport Stitch comparison remain open because localhost was not started.
