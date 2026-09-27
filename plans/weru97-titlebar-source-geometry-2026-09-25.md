# Weru 97 Source-Specific Titlebar Geometry

## Scope

The Stitch screens intentionally use different titlebar heights. Preserve those per-screen measurements instead of forcing a single shell height across every app.

## Implementation

- Keep the shared default at 20px for the desktop-window reference, Internet Explorer, and Media Player.
- Scope 18px titlebars to Explorer/Notepad variants, Paint, Calculator, Minesweeper, CD Player/Equalizer, and the System Properties, System Warning, Shutdown, and Recycle Bin windows.
- Restore the dual-Explorer inactive titlebar's gray gradient and black text.
- Keep System Properties' exact source titlebar padding and active blue gradient as a more specific app rule.

## Verification

- `src/wm/titlebar-source-geometry97.test.ts` maps source HTML titlebar dimensions to registered app IDs and verifies the CSS rule exists for every 18px app.
- Matched-viewport screenshots are still required; this source contract does not prove pixel-perfect browser appearance.
