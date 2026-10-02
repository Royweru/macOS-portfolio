# Weru 97 Live Explorer and Project Video Controls — 2026-09-28

## Scope

Continue Chapter 2 live interaction verification in the current worktree using one existing agent-created Chrome extension tab at `http://localhost:3001/`. No user-owned tabs were navigated, no email was sent, and no production data was changed.

## Browser evidence

- The local app loaded through BIOS, exposed the full-viewport splash, and reached a populated desktop with the persisted Adventures Explorer and README.md windows.
- The `skills-used.txt` Notepad title-bar X removed the editor from the accessibility tree and removed its taskbar button. The README.md window remained open.
- Adventures Explorer maximize filled the shell above the taskbar; Restore returned it to its saved normal mode.
- An east-edge resize increased the visible Explorer width by about 80px (approximately 620px to 700px).
- Explorer title-bar drag moved the window vertically; a later horizontal drag was reflected in the resulting screenshot as a left-edge change from approximately x=90 to x=209. The browser interaction response arrived late, so the exact intermediate rectangle is not claimed.
- Double-clicking the real project file `traveling_agency_1.mp4` opened the Weru Media Player and showed decoded Adventures footage. After dismissing the codec notice, Play advanced the display from 00:00 to 00:02 / 00:34 and changed the status to Playing. The Media Player X closed both the main player and WMP Compact Mode.
- The black horizon between sky and hills remained visible in the full-width desktop. This matches the raw Stitch composition's black page background, 65%-height sky, and bottom-anchored hills; it is not side letterboxing.

## Remaining

- This is a smoke slice, not the all-window control matrix. More apps, resize directions, touch, keyboard, reduced-motion, reload persistence, and narrow viewports still require checks.
- Exact per-screen Stitch screenshot comparison remains incomplete. No full parity or phase completion is claimed.
- The local server was started only for this check and must be stopped after recording evidence.

## Result

Verified the Notepad X path, Explorer maximize/restore, one edge resize, title-bar movement, and actual project-video playback/close in one extension tab. Task-list items remain partial because their broader acceptance matrices are still open.
