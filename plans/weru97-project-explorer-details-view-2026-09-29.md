# Project Explorer Details View — Implementation Note

## Goal

Match the project-folder view in Stitch screen `9e70e97521b041b0b2575fd0322ace42` without replacing Weru's real filesystem contents with the fictional sample rows shown by Stitch.

## Change

- `getExplorerInitialView97()` now selects Details for the Projects root and generated project folder IDs (`project-*`).
- Other directories, including My Documents and the drive root, retain their icon-view default.
- The rule affects the initial view only; users can still choose another view for an open Explorer window.
- Focused tests cover Adventures, AfyaTrack, root, personal documents, and an unspecified initial folder.

## Verification

- Same Chrome-extension tab used sequentially for the unchanged raw Stitch HTML and the running current-worktree app, at a 1422×644 browser viewport.
- After app reload, Adventures opened at `(88,26)`, 620×430 and displayed the source's `Name`, `Size`, `Type`, and `Date Modified` columns with six actual VFS entries.
- The source's five fictional rows were intentionally not copied.
- `npx vitest run src/windows/explorer-presentation97.test.ts`: 1 file / 3 tests passed.
- `npx tsc --noEmit`: passed.

## Remaining gaps

This verifies the project-folder initial view and geometry, not pixel-perfect selection/row styling or all Explorer variants. The screen remains partial; Notepad's complete edit/save workflow and overall app/window matrix are still open. Full-suite lint and build were not rerun for this small slice; the most recent full-gate results are recorded in the task-list header.
