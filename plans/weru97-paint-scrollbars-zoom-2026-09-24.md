# Weru 97 Paint Scrollbars and Scaled Artboard (2026-09-24)

## Source contract

The retained Paint Stitch screen includes a 14px horizontal scrollbar at the bottom of the canvas area, a 14px vertical scrollbar docked to the right, beveled arrow buttons, a 70px horizontal thumb, a 60px vertical thumb, and 20px track insets. The art surface is 580×340 at 100%. The prior React app relied on native browser scrollbars and its 580×340 CSS minimum prevented zoom-out.

## Implementation

- Added source-shaped horizontal/vertical scrollbar chrome with classic beveled arrow controls, inset tracks, source-sized thumbs, and the vertical bar anchored above the horizontal strip.
- Wired arrow clicks, track-page clicks, pointer-captured thumb dragging, and keyboard arrow/PageUp/PageDown/Home/End to the actual canvas viewport.
- Kept native scrolling available to wheel/touch input while visually suppressing duplicate browser scrollbars.
- Wrapped the fixed 580×340 drawing sheet in a scaled layout frame. Zoom now scales the complete art and canvas together, and scrollable overflow tracks the frame instead of fighting a CSS minimum width/height.
- Added accessible scrollbar roles, orientation, value range/current position, and labeled arrows.

## Verification

- Paint-focused tests: 15 passed, covering source chrome markup, scrollbar mapping/clamping, image fit, and drawing geometry.
- Full suite: 46 test files / 186 tests passed.
- TypeScript and lint passed; production build passed with the existing stale Browserslist-data warning.
- No localhost server was started and no live browser interaction was claimed.

## Remaining

- Verify arrow paging, track paging, dragging, keyboard navigation, zoom-out/in, and resulting overflow with real pointer and keyboard input.
- Compare the complete Paint surface with the Stitch artifact at a matched viewport. Keep Paint's manifest status partial until that visual and interaction evidence exists.

