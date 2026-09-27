# Weru 97 Media Player Close Lifecycle — 2026-09-24

## Finding

The shared window manager removes the Media Player content on close, but the app had no explicit media-element cleanup. Relying only on DOM removal risks leaving playback active while the window is gone.

## Change

- Added a lifecycle cleanup keyed to the selected media source. It pauses the captured audio/video element when switching source and when the player unmounts after close.
- Kept existing seek reset and pause behavior in track selection.
- Added tests for pausing a mounted media element and safely handling no active element.

## Verification

- Focused Media Player/lifecycle tests: 4 passed; full suite: 52 files / 203 tests passed.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed; the existing stale Browserslist warning remains. `git diff --check` passed with repository line-ending normalization warnings only.
- Browser playback followed by closing the real window still needs live acceptance; no local server was started.
