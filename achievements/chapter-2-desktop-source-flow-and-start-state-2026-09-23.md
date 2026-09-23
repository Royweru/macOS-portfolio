# Chapter 2 — Desktop Source Flow and Initial Window — 2026-09-23

## Verified work

- Re-read the raw `windows_97_os_desktop.html` rather than trusting the earlier summary. The shortcut matrix uses column-first vertical flex wrapping and a 16px vertical gap; it is not an always-one-column layout.
- Changed Weru shortcut pitch from 64px to 80px while retaining the requested 40px icon artwork and the source-derived 96px column pitch. This restores visible spacing and allows natural wrapping at shorter viewports.
- Added regression coverage for the seven-row first column at a 596px work area, wrapping into column two, and a single-column fit at a 912px work area.
- Added a source-authored `My Documents` initial window rectangle `(240,60,560,410)` and first-visit startup behavior. It only seeds when the session is a clean first visit with no persisted windows; it never clears or rewrites existing user windows.
- Recorded the desktop as part of the Stitch parity target and corrected the tracker/manifest to leave exact screenshot parity partial.

## Source-to-runtime evidence

- Raw source screenshot: `1280×580`.
- Live app screenshot: `1421×644`.
- Those sizes do not form a matched-viewport comparison. At normalized scale, wallpaper layer geometry and colors are consistent. Confirmed intentional Weru adaptations are the 46px taskbar instead of Stitch's 30px and 40px desktop artwork instead of the source's 32px icons.
- The live browser had a pre-existing persisted root File Explorer window. It is preserved, not forcibly replaced; a clean-profile screenshot is still required to verify the new first-visit My Documents state.

## Validation

- `npm.cmd test -- --run src/shell/desktop-layout97.test.ts`: 1 file, 3 tests passed.
- TypeScript: `node_modules\.bin\tsc.cmd --noEmit` passed.

## Remaining

- Capture raw Stitch and live app at the same viewport and compare the complete desktop one-by-one.
- Verify the seeded My Documents window in a clean profile.
- Keep desktop visual status `partial` until that evidence exists.
