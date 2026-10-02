# Weru Paint Stitch Anchor and Live Controls — 2026-09-27

## Scope

Resolve the remaining Paint first-open placement mismatch and perform a focused live comparison against `Stitch Designs/html/windows_97_paint.html`. Browser testing reused one Chrome-extension QA tab at 1422×644; the local app and raw source were viewed sequentially in that same tab. No external links, file uploads, or profile resets were used.

## Changes

- Added `getPaintInitialRect97()` to model the source page's 80px icon rail, 16px top inset, content padding, and centered 840×478 Paint window. The helper clamps to the live work area, handles narrow/short screens, and cascades multiple Paint windows.
- Routed first-open Paint windows through the source geometry helper while leaving other app geometry unchanged.
- Added geometry regressions for the matched wide viewport, narrow work-area clamping, and multiple-window cascade. The test binds expected offsets to the retained Stitch layout classes.

## Browser evidence

- Raw Stitch Paint and the current React app were captured at the same 1422×644 viewport. Screenshot-derived bounds were approximately 840×478 in both; source anchor (326,17), Weru after correction (323,16). The near-3px horizontal/1px vertical difference is within capture/outer-bevel uncertainty and materially closer than the previous vertically centered placement around y=60.
- File menu opened. Options changed the active brush from 1px to 3px. View zoom changed 100% → 125% → 100%. Help opened About Paint and its OK action dismissed the dialog.
- Edit menu keyboard navigation skipped disabled Undo/Redo/clipboard items to the enabled Select All command; Escape closed the menu and returned focus to its trigger.
- A red 3px pencil pointer stroke enabled Undo. Undo restored the canvas to its pre-test pixels. The temporary Paint window was closed afterward; no VFS document was written.
- A rectangular selection marquee appeared after a real pointer drag. Edit → Copy changed the status to “Selection copied”; Paste became enabled and created a floating selection with the expected “drag to position it or press Escape to place it” status.
- On a temporary blank bitmap, Fill With Color reported 197,200 connected pixels and visibly filled the sheet red; Undo returned it to white. A red pencil stroke was removed by the Eraser. Both disposable changes were cleared by File → New and were not saved.
- Text mode opened an accessible editor at the pointer location. Cancel discarded one temporary entry; OK rendered a second temporary “QA” entry, which was undone. No image file was imported, uploaded, or saved, and no operating-system clipboard data was used.
- The Paint title-bar X removed its window and taskbar button. No other app was left open.
- A second disposable canvas verified line, rectangle, and ellipse rendering. Right-clicking the blue palette entry set the background color while preserving the red foreground; erasing a red stroke then produced a visible blue stroke. File → New cleared the test artwork before closing.
- Titlebar drag moved the Paint window by about 20px in each direction. The east edge and southeast corner both resized in browser interaction. The titlebar close button removed the window and taskbar entry.

## Validation

- Focused Paint tests: 3 files / 21 tests passed before the full run.
- Full suite after the geometry change: 70 files / 341 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed all 219 TypeScript files in 28 batches.
- `npm run build`: passed; Next emitted only the existing stale Browserslist data warning.

## Remaining Paint work

This does not complete Phase 8 or mark the Paint screen visually/functionally verified. Curve, Polygon, Rounded Rectangle, image import/export and pixel verification, selection movement/cut/delete/free-form and keyboard clipboard shortcuts, text placement on an imported asset, all menu commands, narrow viewport visual comparison, scrollbar pointer behavior, and concurrent-instance checks remain open. Other Stitch screens and the global per-app interaction matrix also remain incomplete.
