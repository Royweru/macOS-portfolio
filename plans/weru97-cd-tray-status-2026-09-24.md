# CD Player tray and status-bar follow-up

## Stitch contract

The raw source `Stitch Designs/html/windows_97_cd_player.html` keeps an Eject button available, shows a yellow sunken `CD-ROM TRAY OPEN: DRIVE D:\ READY FOR INSERTION` notice, and exposes a `Close Tray` action. Its player also has a classic 18px status strip divided into total time, current-track time, and CD-ROM drive state compartments.

## Implementation

- Eject pauses and releases the current audio track, resets its elapsed/duration display, and opens the simulated tray even when the music library is empty.
- The source-shaped warning notice is rendered as a separate yellow, beveled UI region; `Close Tray` dismisses it and returns the drive state to `No Disc`.
- Selecting a track closes the tray and returns the drive to `Ready`.
- Added the source's separate 18px, three-pane player status bar and live drive-ready indicator instead of combining those values into the shuffle/repeat controls.
- Raw Stitch HTML remains untouched; the interaction is React state, with layout in shared CSS.

## Verification

- Tray-transition tests cover eject, close, and idempotent close behavior.
- Server-rendered component regression verifies the three status compartments and that Eject is available in the no-disc state.
- Source-contract test pins the raw tray notice, close action, and status-row text.
- Focused CD tests: 4 files / 12 tests passed; TypeScript and scoped lint passed.
- Full repository gates passed on 2026-09-24: `npx tsc --noEmit`, `npm run lint`, `npm test -- --run` (57 files / 219 tests), and `npm run build`. Build emitted the existing stale Browserslist-data warning. `git diff --check` passed with line-ending normalization warnings only.
- No browser session or localhost server was started.

## Remaining

This does not prove matched-size visual parity or audible audio. Both remain partial in the Chapter 2 tracker.
