# CD Player window controls — 2026-09-29

## Scope

Live-check the CD Player and its companion Graphic Equalizer in the existing Chrome extension tab at `http://localhost:3001/`. No external links were opened and no user files or media were changed.

## Results

- Opened CD Player from the taskbar quick-launch button. The 540×420 app window appeared with its sibling Graphic Equalizer.
- Dragged the title bar; the window moved about +60px horizontally and +59px vertically.
- East-edge resize increased the width by about 50px. A southeast-corner resize increased width and height by about 50px each. The first drag at the extreme outer corner selected underlying text instead of resizing; retrying several pixels inside the visible corner handle succeeded. This warrants keeping precise edge reach and the full per-app direction matrix open.
- Minimize removed the app window from the desktop while retaining its taskbar button; clicking the taskbar button restored it.
- The title bar's Maximize control was disabled in the accessibility tree, consistent with the retained Stitch CD Player source contract. No maximize behavior is expected for this window.
- Clicking Close removed both CD Player and its companion Graphic Equalizer and removed both taskbar entries.
- With no playable personal tracks configured, playback controls and reference-only sample rows were disabled and the app explained how to add real audio. No audio playback is claimed.
- The local server was stopped after the CD check, then restarted for the subsequent Run/Find check; it was stopped again afterward and port 3001 was confirmed to have no listener.

## Remaining verification

This verifies common controls for this CD Player instance only. It does not complete the all-app window matrix, all eight edge/corner directions, audio playback, or matched-viewport source comparison. The resize test also found one extreme-corner hit that missed before the successful inner-corner retry; this remains noted rather than hidden.
