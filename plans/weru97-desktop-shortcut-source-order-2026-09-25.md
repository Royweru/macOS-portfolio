# Weru 97 — Desktop Shortcut Source Order

## Objective

Keep desktop shortcut order and the additional Outlook Express shortcut consistent with the retained Stitch desktop screen while preserving Weru's larger pixel artwork and responsive full-width desktop.

## Source audit

- `Stitch Designs/html/windows_97_os_desktop.html` contains nine source shortcuts in a fixed order.
- Stitch labels two IDs as `pictures` and `ie`; the VFS uses the clearer IDs `my-pictures` and `internet`. The mapping must not alter their displayed positions.
- Outlook Express is a Weru addition and follows the nine source shortcuts.
- Pairwise 88×72 shortcut-cell checks at 596px, 722px, and 912px work-area heights prove the default responsive positions do not overlap; at 596px, Games, Recycle Bin, and Outlook Express occupy successive rows in column two.

## Implementation and verification

- Exported the canonical source order used by `Desktop97` so the source-contract test can compare actual render ordering.
- Added `src/shell/desktop-shortcut-source97.test.ts` to compare raw Stitch IDs (including explicit alias normalization), 40px art in a 32px SVG viewBox, and pairwise collision-free placement at the reported and wider work-area heights.
- Focused desktop source/layout tests pass (2 files / 8 tests).
- This is a structural/source contract, not a screenshot comparison. Live matched-viewport visual QA remains open while localhost is stopped.
