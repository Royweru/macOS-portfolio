# Weru Paint Functional Menus — 2026-09-26

## Goal and source evidence

`Stitch Designs/html/windows_97_paint.html` contains the Paint menu bar as a 19px strip with six mnemonic captions: File, Edit, View, Image, Options, and Help. The prior React implementation rendered those captions as inert buttons. The retained source does not define the contents or behavior of the dropdowns, so command semantics below are explicit functional adaptations rather than claims that Stitch supplied those menu-item designs.

## Implementation

- Replaced inert captions with six accessible, keyboard-operable classic dropdown menus. The strip preserves the 19px height, 9px menu typography, and underlined mnemonic letters.
- Added File actions for a blank canvas, local image import, PNG download, and closing Paint through the window manager.
- Added Edit actions for undo/redo, select all, cut/copy/paste/delete. A bounded 20-step bitmap history backs Undo/Redo; unsupported clipboard/history operations are disabled instead of appearing active.
- Added View zoom presets and Color Palette visibility, Image horizontal/vertical flips and 90-degree rotation, Options brush widths and palette toggle, plus working Help Topics/About dialogs.
- Routed Ctrl+N/O/S/Shift+S/Z/Y/X/C/V/A and zoom shortcuts through the focused Paint surface. Menu keyboard handling supports opening from the mnemonic key, directional movement, Home/End, and Escape dismissal.
- Passed the window close callback into Paint so File → Exit closes the actual managed window.

## Verification

- Focused Paint suite: 4 test files / 20 tests pass. The tests cover the six source menu names, command-to-handler contract, disabled states, unique IDs for multiple Paint windows, source-sized menu bar, palette order, drawing helpers, and scrollbar geometry.
- Full suite: 69 test files / 323 tests pass.
- `npx tsc --noEmit` passes.
- Targeted ESLint passes for changed Paint/App files; `npm run lint` passes for all 216 configured TypeScript files in 27 batches.
- `npm run build` passes. It emits the existing stale Browserslist database notice.

## Limits still open

- No local server was started and no browser UI was opened for this slice, consistent with the user's request to keep localhost stopped. Actual menu click/focus, local-file dialog/download, pointer drawing, and source-matched viewport comparison still require browser verification.
- Stitch supplies the menu bar appearance but not its dropdown design. Menu item labels/semantics are Win97 functional design decisions; they are not represented as exact Stitch dropdown copies.
- PNG export saves the current canvas bitmap through the browser download flow; it does not write into the virtual filesystem.
- Paint and the overall Chapter 2 objective remain partial until those live checks and the remaining app/screen parity tasks are complete.
