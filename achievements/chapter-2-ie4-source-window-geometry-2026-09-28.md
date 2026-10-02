# Chapter 2 — IE4 Stitch Window Geometry

Measured the retained IE4 source wrapper and corrected the live first-open window to match its padded 96%-height composition. At the same 1422×644 CSS viewport, the raw source rectangle is about 940×563 at (281,28); the live New Window instance measured 940×563 after the expected cascade and taskbar clamp. A narrow-viewport test protects the desktop shortcut rail. The temporary IE window was closed and the original saved window remained intact.

The IE4 outer geometry is now source-aligned; complete page, interaction, and deployment parity remains partial.

See [the implementation and verification plan](../plans/weru97-ie4-source-window-geometry-2026-09-28.md).
