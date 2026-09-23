# Achievement — Stitch Desktop Single-Column Correction

Date: 2026-09-23

## Verified change

- Rechecked the authoritative desktop source, `Stitch Designs/html/windows_97_os_desktop.html`, against the live Weru 97 shell. The source's nine shortcuts form a vertical left-side stack; the existing live implementation incorrectly wrapped them into multiple columns at the user's current short browser viewport.
- Updated the responsive desktop placement to use a 64px row pitch with the existing 40px pixel artwork. At a 1422×642 browser viewport (596px desktop work area after the requested 46px taskbar), all nine shortcuts now remain visible in one column, in Stitch order.
- Kept the user's requested full-width shell, larger icons, taller taskbar, Weru 97 name, and saved custom icon positions. Legacy default shortcut coordinates are recognized so they do not force the previous multi-column arrangement.
- Added a boundary test: all nine fit at 596px work-area height; the ninth wraps only when the available height is too small to fit the full stack.

## Evidence

- Live localhost:3001 screenshot after leaving the idle screensaver: Bliss desktop spans the viewport; all nine desktop icons are stacked at the left; My Documents is selected; the 46px taskbar spans the full width. An open My Documents window remains visible and unaffected.
- `npm.cmd test -- --run src/shell/desktop-layout97.test.ts`: 1 test file, 2 tests passed.

## Still open

This closes only the desktop icon-flow defect. It does not establish exact pixel parity for the complete desktop, boot screen, or other Stitch screens. The matched-viewport desktop comparison and the broader Chapter 2 window/app interaction matrix remain open and must stay partial in the tracker.
