# Weru Media Player Source Geometry and Placement — 2026-09-26

## Goal

Finish the source-sized Media Player window after the prior audit corrected its outer bounds but live rendering showed its inner rows spilling outside the 640×396 shell.

## Source contract

The retained Stitch HTML places its 640×396 main player window at (80,56). Its visible client structure uses a 20px titlebar, 20px menu row, 260px video display, compact seek row, 176px playlist, 24px playlist footer, transport deck, and 20px status bar. The alternate desktop wrapper is not copied into the application window.

## Implementation

- Preserve the narrow v22 migration from only the obsolete default 640×520 Media Player rectangles; do not overwrite custom saved dimensions.
- Use a source-authored initial rectangle (80,56,640,396), clamped to the live work area. Cascade duplicate media windows from that anchor.
- Scope a 1px window frame and a flex-column layout to Media Player; remove the generic screen margin; size its display, seek, playlist/footer buttons, transport, and status rows to fit.
- Keep the menu closed on ordinary launch; verify that a user click opens the source-shaped File menu.
- Keep the compact player and codec notice on the separate desktop overlay layer.

## Verification

- Raw Stitch page and local app were inspected in one existing Chrome extension tab; no additional browser tab was opened.
- The raw source was viewed at 1280×580. The current build was viewed at 1422×702. Despite those different full-page viewports, the extracted player was visibly checked at the same authored window rectangle, (80,56) and 640×396. The active titlebar, File menu state, video/playlist area, transport, and status row were compared. This is component-window evidence, not a full-screen matched-viewport pixel diff.
- Focused tests passed: 3 files, 52 tests. The full suite passed: 67 files, 312 tests. `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed. `git diff --check` exited successfully; Git emitted only its existing LF-to-CRLF working-copy warnings.
- Local ports 3000 and 3001 were stopped after the browser check. These project gates validate the current worktree; the complete Media Player behavior matrix and global Chapter 2 acceptance are still pending.

## Remaining acceptance

- Capture source and React at the same full viewport for pixel-by-pixel comparison.
- Verify File-menu keyboard and command behavior, direct URL playback, project media, playlist actions, and the compact window live.
- Re-test controls, seeking, volume, end state, reduced motion, and audio behavior. Keep the manifest and Chapter 2 checklist partial until those pass.
