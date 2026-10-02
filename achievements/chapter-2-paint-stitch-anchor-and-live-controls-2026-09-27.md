# Chapter 2 Achievement — Paint Source Anchor and Live Controls

**Date:** 2026-09-27  
**Scope:** Chapter 2, Phases 8 and 12 — Paint first-open geometry and focused live browser QA

Added source-aware first-open geometry for Paint. A same-tab, matched-viewport comparison against the retained Stitch HTML showed the Weru window at approximately 840×478, (323,16), versus Stitch at approximately 840×478, (326,17). The helper centers within the source content column beside the icon rail, honors the top inset, clamps small viewports, and cascades separate Paint instances.

Live browser checks verified File/Options/View/Help menu opening, 3px brush selection, zoom to 125% and restoration to 100%, About Paint dismissal, Edit keyboard navigation/Escape, titlebar movement, resize, and close. Follow-up passes used disposable blank bitmaps to verify pencil/undo, line, rectangle, ellipse, right-click blue background selection, erasing with that background color, rectangular pointer selection, Edit-menu Copy/Paste, connected fill over 197,200 pixels, and text cancel/commit/render/undo. The canvas was reset with File → New, Paint closed without saving, and no OS clipboard data was touched. The full suite passed after the code changes (70 files / 341 tests), TypeScript passed, lint passed across 219 files, and production build passed with the existing stale Browserslist notice.

Paint remains partial: full internal pixel parity, image import/export, Curve/Polygon/Rounded Rectangle, selection move/cut/free-form/shortcut paths, text placement on imported artwork, responsive comparisons, and complete command coverage are not yet verified. This record does not complete the phase or Stitch screen.
