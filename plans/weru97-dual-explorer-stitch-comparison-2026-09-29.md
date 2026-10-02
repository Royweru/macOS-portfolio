# Weru 97 Dual Explorer Stitch Comparison — 2026-09-29

## Scope

Compare Stitch screen `0f3046a574c8480da785b5f8f49b8b31` with the active Weru 97 app, extracting the Projects Explorer window rather than its duplicate desktop shell or fictional sample files.

## Browser evidence

- Reused the existing Chrome-extension tabs for Weru at `http://localhost:3001/` and the local Stitch source at `http://localhost:3002/windows_97_dual_explorer_windows.html`; opened no extra tabs and used no native-computer controls.
- The live app viewport was 1422×644 CSS pixels. The raw source page contains a centered 1024×768 desktop wrapper, so its canvas begins outside the visible viewport; its application-window frame is still the relevant comparison target.
- The Stitch Projects window is authored at `(240,90)`, `660×440`, with a roughly 200px folder tree, File/Edit/View/Tools/Help menu, and a Details table headed Name, Size, Type, and Date Modified.
- Weru's fresh Projects navigation used the same 660×440 source rectangle at `(240,90)`. The source-shaped Details view, 200px tree pane, matching column proportions, correctly ordered metadata, and Tools → Find menu were visible in the live browser.
- The two existing Explorer instances remained independent. The My Computer/root surface was kept behind Projects; source and Weru folder contents intentionally differ because the source contains fictional project names while Weru uses the real VFS project directories.
- An already-saved Projects window opened from the desktop shortcut at its prior custom rectangle. This was preserved rather than overwritten; a fresh Projects view reached through root Explorer navigation demonstrated the source rectangle. The evidence does not justify changing persisted user geometry.

## Change made

- Projects now opens in Details view, while other Explorer folders keep their existing Large Icons default and the user can still select another view.
- Details rows now align size, file type, and modified date with their actual headers. Folder rows use the classic `File Folder` label and have no fabricated byte size.
- The Projects view uses the source's wider folder tree and Details-column proportions. Its Tools menu exposes Find, wired to the existing in-folder search bar.
- Raw Stitch HTML and portfolio/VFS content were not changed.

## Verification

- `npx vitest run src/windows/explorer-presentation97.test.ts src/features/apps/explorer-stitch-geometry97.test.ts` — 2 files, 6 tests passed.
- `npx tsc --noEmit` — passed.
- `npx eslint src/windows/ExplorerContent.tsx src/windows/explorer-presentation97.ts src/windows/explorer-presentation97.test.ts` — passed.
- Browser verification showed Name/Size/Type/Date Modified and all four real project folders. Tools → Find opened the live search field; Hide Find Bar closed it again.

## Still open

- The independent My Computer window is not a pixel-identical drive-icon mock: Weru continues to expose the real C: filesystem contract.
- Full matched-screen parity remains partial, including exact tree hierarchy, source selection styling, all Explorer screen variants, and narrow viewport behavior.
- No Explorer parity phase is declared complete from this single screen comparison.
