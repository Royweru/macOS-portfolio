# CD Player menu actions — 2026-09-24

## Source contract

The preserved Stitch CD Player shows Disc, View, Options, and Help menus above the dual LCD / transport / track interface. The original HTML leaves these controls as presentation-only; Weru must connect them to the real player state.

## Implementation

- Disc menu exposes Eject CD Tray and Close Tray, respecting the current tray state.
- View menu launches the sibling Graphic Equalizer window.
- Options menu toggles Random Shuffle, Continuous Repeat, and Intro Scan using the same shared playback-mode state as the transport buttons.
- Help menu opens a classic About CD Player dialog; Escape and its close/OK controls dismiss it.
- Menu popovers use compact Win97 bevels and close when the user clicks outside or selects a one-shot command.
- Arrow Down opens the focused menu; the first enabled item receives focus; Arrow Up/Down wrap, Home/End jump to the ends, and Escape returns focus to the trigger.

## Verification

- CD navigation helper and player render/state tests pass. Full gates pass after this change: `npx tsc --noEmit`, `npm run lint`, `npm test -- --run` (60 files / 231 tests), `npm run build`, and `git diff --check`. The build reports the existing stale Browserslist-data warning.
- No local server or browser was started.

## Remaining

Live menu click/dismissal, actual keyboard focus behavior, and matched-viewport appearance remain part of the CD Player visual/interaction acceptance.
