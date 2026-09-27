# Weru 97 Paint Dual-Color Behavior (2026-09-24)

## Stitch contract

The Paint source includes overlapping foreground/background color wells above its 28-swatch palette. Translate that into classic Paint input semantics: left-click selects/uses the foreground color; right-click selects/uses the background color. The eraser paints with the background color rather than erasing pixels to transparency.

## Implementation

- Added separate foreground and background state and reflected both colors in the source-positioned wells.
- Added left/right swatch selection. Canvas drawing, shape outlines, fill, and color picking use the active pointer button's color; the eraser always paints the background color.
- Text entry captures the selected foreground/background color when the text tool is activated and commits text using that color.
- Suppressed the browser context menu on the canvas so secondary-button painting works. Swatches expose the foreground/background behavior in accessible names, title text, and selected-state data attributes.
- Extracted the ordered 28-color palette into a shared constant and added a regression that compares its values/rendered order and the 2×14 grid flow directly against the raw Stitch HTML/CSS.
- Preserved the Stitch 2×14 swatch layout and existing drawing geometry.

## Verification

- `Paint97.test.ts`: 14 tests pass, including exact ordered palette parity with the raw Stitch source, left/right color mapping, background-color eraser mapping, source well rendering, and existing canvas/tool regressions.
- Full suite: 46 files / 188 tests passed.
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `git diff --check` passed. Build reports the existing stale Browserslist database notice.
- No localhost runtime was started; real mouse-button interaction and matched-viewport comparison remain unverified.
