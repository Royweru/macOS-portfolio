# Weru 97 Desktop: Direct Stitch Browser Comparison — 2026-09-29

## Scope

Compare the unchanged authoritative desktop Stitch HTML with the active Weru shell using the existing Chrome-extension tabs. The user requires the full-width browser desktop, larger taskbar/icons, and Weru branding; Stitch's 1024×768 is only a composition reference.

## Method

- Reused the existing Weru app tab (`localhost:3001`) and source tab (`localhost:3002/windows_97_os_desktop.html`); no tabs were added.
- Both pages used a 1422×702 CSS viewport at devicePixelRatio 1.35.
- Captured the Weru shell with the existing saved app windows hidden via Show Desktop, then restored the saved windows individually from their taskbar buttons.
- Read-only measurements and screenshots; no window was closed, no file content changed, and the raw Stitch HTML remained untouched.

## Measurements and observations

- Both outer shell roots fill the 1422×702 browser viewport.
- Stitch's desktop icon grid is 192×672 at (0,0); Weru's desktop work area is 1422×656 at (0,0), ending above its taskbar.
- Stitch taskbar: 1422×30 at y=672. Weru taskbar: 1422×46 at y=656. Weru's taller taskbar is the explicit user-requested sizing change.
- The sky, cloud arrangement, black horizon band, and layered green hills visually align. The dark band is in the Stitch source itself, not an outer black border.
- Stitch icon cells are 72px wide, with 68px heights for the first two and 56px thereafter; the Weru cells are 88×60 with a 72px vertical pitch. Weru uses the requested larger local pixel artwork and user-facing labels.
- Weru places Recycle Bin in column two and adds Outlook Express below it. In the live capture Outlook Express is clear of Games, which remains in column one. This added shortcut is not part of the original desktop source.
- Stitch's source page includes a My Documents Explorer window. That app surface was not compared in this shell-only pass because the app tab had a restored multi-window profile; saved windows were left intact. Clean first-visit composition remains a separate acceptance item.

## Status

Desktop visual parity remains partial. Full-width wallpaper and shell geometry are verified at this viewport, with the larger taskbar/icon scale and Outlook Express shortcut recorded as intentional Weru adaptations. Exact pixel-art matching, selection/focus appearance, responsive viewport comparison, and the default My Documents window comparison remain open. No phase or parity task is marked complete by this evidence alone.

The temporary localhost app and source servers were stopped after the comparison; ports 3001 and 3002 were verified to have no listeners.
