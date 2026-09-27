# CD Player and Graphic Equalizer — sibling-window implementation

## Source audit

The retained Stitch file `Stitch Designs/html/windows_97_cd_player.html` defines `#cd-player-window` and `#eq-window` as two sibling surfaces. Their maximum widths are 540px and 390px; both title bars are 18px. The surrounding layout centers a row at the large-screen breakpoint and wraps below it. The CD Player's maximize control is explicitly disabled, while the Equalizer has no maximize control. The Stitch page also includes its own footer/taskbar and desktop wrapper, which are not copied into Weru's production app.

The source does not declare fixed window heights. Weru currently uses 540×420 and 390×360 as opening sizes, so those heights are implementation defaults, not claims about measured Stitch height.

## Implementation

- Added `CdEqualizer97` as its own registered application/window and pixel icon.
- Shared playback status and equalizer settings through a small Zustand store so the sibling UI stays synchronized.
- Open the equalizer first and CD Player second, preserving the player as the focused/top window; center the pair on wide viewports and use the source-like stacked arrangement below 1024px.
- Use common Window97 drag, resize, focus, minimize, restore, and close behavior. Match the source titlebar dimensions and its two different maximize-control policies.
- Closing the CD Player closes its equalizer companion. Unmounting the player pauses audio, resets shared playing status, disconnects the effects graph, and closes its audio context.
- Translate the source's seven segmented green/yellow/red spectrum meters into React-rendered segments; keep controls, presets, EQ bypass, and same-origin Web Audio processing functional.
- Keep source HTML untouched and production rendering React/CSS-only.

## Verification

Verified on 2026-09-24:

- Stitch source-contract tests: sibling IDs, source widths, titlebar height, responsive row, and maximize-control differences.
- Geometry and launch tests: wide centered placement, narrow stacked placement, equalizer-first open/player focus, and player-close companion policy.
- Shared store tests include both CD windows; titlebar rendering tests check disabled/absent maximize controls.
- `npx tsc --noEmit` passed.
- `npm run lint` passed.
- `npm test -- --run` passed: 56 test files / 216 tests.
- `npm run build` passed. It emitted the existing stale Browserslist database warning.
- No local server was started and no browser screenshot was captured during this slice.

## Still open

- Matched-viewport visual comparison against the raw Stitch screen is not yet done.
- No bundled audio is present, so actual playback, end-state, and audible EQ behavior remain unverified.
- Per-app live pointer/touch control coverage remains part of the wider Chapter 2 matrix.
