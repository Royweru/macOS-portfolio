# Weru 97 CD Player Live Menu Smoke — 2026-09-28

## Scope

Verify the highest-value CD Player menu actions in the current local build using the browser extension. This is a behavior smoke test, not a claim of complete CD Player functionality or Stitch visual parity. The preserved source is `Stitch Designs/html/windows_97_cd_player.html`; the source-derived menu/window mapping is documented in `src/data/stitch-screen-manifest.ts`.

## Browser evidence

- Used the existing single Chrome-extension QA tab at `http://localhost:3001/`, at a 1422×664 viewport. No additional browser or tab was opened for this check.
- With no playable audio loaded, the CD Player truthfully showed `NO DISC (D:)`, disabled transport controls, and the message that audio must be added to `C:\Music` or opened from Explorer.
- Disc menu: Eject CD Tray changed the drive to the open-tray state; Close Tray returned to `NO DISC (D:)`.
- Options menu: Random Shuffle changed from off to on and back off; Intro Scan changed from off to on and back off; Continuous Repeat remained on.
- Escape dismissed the Options menu and returned focus to its trigger button.
- The CD Player and its sibling Graphic Equalizer appeared as separate windows. Both temporary test windows were closed; the pre-existing Adventures Explorer and Notepad windows were preserved.
- The development-server process on port 3001 was stopped. The browser extension refused the request to close the QA tab, so the already-loaded tab was left untouched; no listener remained on port 3001.

## Not verified

- No audio file was loaded, so audible playback, track selection, transport, seek, volume, balance, equalizer processing, end-of-track behavior, and reduced-motion behavior were not tested.
- In this first pass, View-menu launch, Help/About, and keyboard navigation were not exercised; a later same-day follow-up verifies View → Graphic Equalizer, Help → About CD Player, ArrowDown, End, Escape, and focus return. See `plans/weru97-cd-player-view-help-keyboard-smoke-2026-09-28.md`.
- Outside-click dismissal, left/right wrapping, Home-key behavior, and the complete menu/window control matrix remain open.
- The live app was not captured side-by-side with the raw Stitch source at a matched viewport. The screenshot is an app-only observation, not proof of pixel parity.

## Code and checks

No application code changed in this verification-only slice. Prior code gates are not being represented as rerun for this pass. Documentation consistency is checked with `git diff --check`.
