# Explorer Folder-Navigation Stitch Fidelity — 2026-09-27

## Goal

Make the existing Explorer window reflect the folder currently being browsed, and apply the correct Stitch geometry when moving between the Projects root and an individual project. The window remains one draggable/resizable instance; navigation must not spawn an Explorer for every folder.

## Evidence that exposed the gap

At a matched 1280×640 browser viewport, opening `C:\Projects\Adventures` changed the address and file list but left the window caption as `Projects` and retained the Projects-root rectangle. That did not match the Stitch project screen, where the project window is authored at (88,26), 620×430. The parent Projects view has a distinct rectangle at (240,90), 660×440.

## Implementation

- `ExplorerContent` now reports folder changes for double-click navigation, Back/Up, and the folder tree.
- `App` updates the existing keyed Explorer instance's `locationId` and title from the folder, keeping restored state in step with the visible address.
- Named source layouts are restored when navigating to My Computer, Projects, or My Documents. Project folders use the project-screen geometry and cascade only against other project Explorer instances, excluding the window currently navigating.
- README and other project documents still open through the existing central file router; the app uses real manifest-backed file names/content rather than the dummy `3D-Website` data in the Stitch prototype.

## Verification

- Same Chrome-extension tab and 1280×640 viewport used sequentially for the retained Stitch HTML and the current local app.
- Browser verified Projects at (240,90), 660×440; Adventures at (88,26), 620×430 with matching caption/address; Up returned the window to the Projects caption and rectangle.
- Browser opened Adventures `README.md`; the rendered linked Markdown appeared in the source-sized 580×450 Notepad at (320,90).
- Focused geometry tests: pass (5 tests).
- Full test suite: pass (69 files, 337 tests).
- TypeScript: pass (`npx tsc --noEmit --incremental false`).
- Lint: pass (217 TypeScript files).
- Production build: pass. Existing Browserslist database age warning remains non-blocking.
- `git diff --check`: pass before the documentation update; rerun after final edits.

## Still open

- This is not a claim of exact screen parity. Stitch combines overlapping sample windows and alternate desktop states; the real Explorer uses live VFS items and currently presents the icon layout instead of the sample's fabricated detail rows.
- The prototype caption says `README.txt - Notepad`; the live app correctly uses the portfolio's real `README.md` filename and currently omits the optional ` - Notepad` suffix.
- Notepad dirty-close confirmation, full editing/save/find browser acceptance, and the rest of the 12-screen comparison remain partial.
