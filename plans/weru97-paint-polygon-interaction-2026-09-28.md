# Weru 97 Paint Polygon Interaction — 2026-09-28

## Goal

Replace Paint's placeholder drag-triangle behavior with a practical multi-point Polygon tool while keeping the Stitch-derived Paint surface and existing canvas history behavior intact.

## Source and scope

- Raw Stitch source remains unchanged at `Stitch Designs/html/windows_97_paint.html`.
- Scope is the Polygon drawing behavior inside the existing 580×340 Paint bitmap surface; no alternate desktop background or duplicate shell is copied into Paint.
- A polygon draft is transient until committed. Escape or changing tools restores the original bitmap; Enter commits a closed path; Undo can restore the pre-polygon bitmap.

## Implementation

- Added `shouldClosePaintPolygon97()` for an intentional return to the first vertex and `tracePaintPolygon97()` for arbitrary open-preview/closed-commit paths.
- Paint records each clicked corner, previews the open path to the pointer, commits on Enter, double-click, or a click near the first point, and cancels on Escape.
- New/Open/tool-switch flows discard an in-progress draft; Save As commits it before exporting. Help text describes the interaction.
- Added geometry tests for multi-corner paths, open/closed traces, insufficient vertices, and close-to-first detection.

## Verification evidence

- Focused `Paint97.test.ts`: 17 tests passed.
- Browser extension at `http://localhost:3001/`, viewport 1422×696: selected Polygon, placed three corners, observed the live preview, pressed Enter, and visually confirmed the closed triangle plus “Polygon drawn with 3 points”. Ctrl+Z removed the test drawing. A new draft was then cancelled with Escape and the status showed “Polygon cancelled”.
- Closed the temporary Paint window without saving. No user project or image file was written.
- Full suite: 71 files / 350 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed all 222 TypeScript files.
- `npm run build`: passed; only the existing stale Browserslist database notice appeared.
- `git diff --check`: passed; Git printed only the repository's existing LF-to-CRLF notices.
- The temporary development server on port 3001 was stopped after browser verification.

## Remaining work

This does not complete Paint parity. Curve, Rounded Rectangle, image import/export behavior, pixel-level comparison, free-form selection, selection movement/cut/delete, keyboard clipboard shortcuts, and text placement on imported assets remain open or partial. Other Stitch screens and the all-app window-control matrix also remain in the Chapter 2 task list.
