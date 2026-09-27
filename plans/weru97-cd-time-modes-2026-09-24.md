# CD Player time modes — 2026-09-24

## Stitch behavior

The CD Player reference provides three display modes: Track Elapsed, Track Remain, and Disc Remain. Disc Remain is measured over the ordered playlist, not just the currently selected track.

## Change

- Added `calculateCdTime97()` to compute elapsed/remaining values and total play time from the playlist and selected track.
- Disc elapsed time now includes all known durations for earlier tracks plus the current track's elapsed time.
- The loaded media element's duration takes precedence over stale manifest duration for the selected track.
- Negative, non-finite, and beyond-end playback values are clamped to safe display values.
- Connected the calculation to the CD Player LCD and total-play status pane; playback controls and playlist order are unchanged.

## Verification

- Focused CD tests: 2 files / 7 tests passed, including all three modes, prior-track accounting, loaded-duration override, and clamping.
- TypeScript and scoped ESLint passed.
- Full repository gates passed on 2026-09-24: `npx tsc --noEmit`, `npm run lint`, `npm test -- --run` (57 files / 221 tests), and `npm run build`. Build emitted the existing stale Browserslist-data warning. `git diff --check` passed with line-ending normalization warnings only. No local server or browser was started.

## Remaining

This calculation fix does not establish audible playback or matched-viewport Stitch parity; both remain partial in the Chapter 2 task list.
