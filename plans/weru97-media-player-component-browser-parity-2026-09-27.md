# Weru 97 Media Player Component Browser Parity — 2026-09-27

## Goal

Continue the Phase 7 one-screen-at-a-time comparison by isolating the Media Player app and its desktop-level companion surfaces from the alternate desktop inside Stitch.

## Comparison method

One Chrome-extension tab viewed `Stitch Designs/html/windows_97_media_player_6.4.html` and the local Weru build sequentially at the same 1280×640 viewport. No native computer control, second QA tab, external link, or message was used. The raw source’s desktop wrapper was treated as context only; comparison focused on the main player, compact player, and Codec Notice.

## Verified

- Stitch and Weru main-player rectangles matched at (80,56), 640×396.
- Opened the project’s real `C:\Projects\Adventures\traveling_agency_1.mp4` from Explorer. The app showed the actual project clip and 00:00/00:34 duration; Play advanced to 00:10 and 30%, then reached 00:34 / playback complete.
- Opened the File menu and verified its source commands were present.
- Opened Favorites, added the current clip, reopened the menu to verify it appeared, then removed it to avoid leaving test state behind.
- Compact Play/Pause changed the main player’s status/time; compact surface moved from about (976,65) to (797,165), then closed without closing the main window.
- The Codec Notice appeared in its source desktop-layer position and was dismissed with OK without selecting “Don't show this again.”
- Closed the test Media Player and project Explorer; restored the pre-test My Documents view while retaining the pre-existing IE and Control Panel windows.
- Both temporary local servers (app on port 3001 and raw-source server on port 3002) were stopped; a listener check returned no active ports.

## Still open

The screen remains `partial` in the Stitch manifest. No pixel-diff comparison was captured; actual project content intentionally differs from the source’s fabricated three-item `demo.avi` playlist. Direct Open URL playback, menu keyboard shortcuts, playlist editing, volume/seeking behavior, real audio, reduced-motion behavior, all four project videos in the browser, and deployed-bundle parity remain open.
