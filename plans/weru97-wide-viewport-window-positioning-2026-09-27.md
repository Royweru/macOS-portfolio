# Weru 97 Wide-Viewport Window Positioning — 2026-09-27

## Problem

The shell and wallpaper were full-width, but `getLogicalWindowPosition()` still centered newly opened windows inside `min(viewport, 1024×768)`. At a wide viewport this left source-sized windows clustered near the left icon columns, which made the desktop feel unbalanced and put Outlook Express beside its shortcut.

## Change

- Keep 1024×768 as a Stitch source-composition reference and retain source-authored window dimensions.
- Center new windows using the live browser width and taskbar-excluded work-area height.
- Continue clamping against current bounds, so narrow screens and the taskbar remain safe.
- Add geometry regressions for 1422×598 and tall 1422×854 work areas.

## Verification

- `npx vitest run src/wm/geometry97.test.ts` — 7 tests passed.
- Chrome extension, existing single tab, 1420×640 screenshot viewport: Outlook Express opened at approximately (390, 56), centered in the live viewport and clear of desktop shortcuts; title-bar close removed the window and taskbar button.
- `npm test -- --run` — 69 files / 338 tests passed.
- `npx tsc --noEmit` — passed.
- `npm run lint` — all 217 TypeScript files passed.
- `npm run build` — passed. Existing Browserslist data-age warning is non-blocking.
- Temporary development server stopped after browser verification.

## Remaining

Responsive browser screenshots at laptop/tablet/narrow widths, every-app initial-position checks, the complete window-control matrix, and whole-screen Stitch parity remain partial.
