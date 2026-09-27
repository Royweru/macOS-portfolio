# Chapter 2 — Paint Functional Menus (2026-09-26)

## Completed

- Replaced Paint's six inert menu captions with accessible File/Edit/View/Image/Options/Help dropdowns.
- Implemented local image import, PNG export, New/Exit, bitmap undo/redo, selection and clipboard commands, zoom and palette visibility, image flips/rotation, brush widths, and Help/About dialogs.
- Connected File → Exit to the managed window close callback and added menu keyboard navigation/mnemonics.
- Made menu and dialog IDs unique per Paint window to keep simultaneous app instances isolated.
- Preserved an honest boundary between Stitch evidence and implementation decisions: the source specifies the menu strip and names, but not its dropdown contents.

## Verification

- Focused Paint checks: 4 files / 20 tests pass.
- Full test suite: 69 files / 323 tests pass.
- TypeScript and targeted ESLint pass; repository lint passes across 216 TypeScript files.
- Production build passes with the existing stale Browserslist data notice.

## Remaining

- Live browser verification of menu focus/clicks, image import/download, and pointer workflows remains open; no localhost was started for this slice.
- Matched-viewport comparison of the entire Paint screen remains open. Paint parity and the Chapter 2 objective are not complete.
