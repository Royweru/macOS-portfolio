# Weru 97 Boot Splash Layout Contract — 2026-09-25

## Goal

Close concrete CSS and DOM-structure drift between the active React splash and the preserved `windows_97_boot_screen.html`, without copying its embedded desktop or restoring Microsoft branding.

## Changes

- Restored the source splash's explicit column flex axis.
- Restored the source layering level for the logo/content group.
- Reintroduced the source flag wrapper as a separate 130×120 box with its drop-shadow; the SVG fills the wrapper and retains the exact source primitives.
- Restored the progress frame's flex alignment/positioning and each segment's 100ms background transition.
- Replaced shorthand splash typography with source-matched font families/fallbacks and added comparisons for logo/subtitle typography, splash, content, progress-track, segment, flag-wrapper, and footer properties directly against the raw HTML's CSS.
- Updated the Chapter 2 ledger and boot screen manifest. Boot parity remains partial until matched-viewport runtime captures and live behavior checks are complete.

## Verification

- Focused boot regressions passed: 2 files / 9 tests.
- Full repository suite passed: 62 files / 239 tests.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed. Build reported the existing stale Browserslist database warning.
- `git diff --check` passed; Git emitted only existing LF-to-CRLF normalization notices.
- Full boot functionality and matched-viewport browser capture are not claimed.
- No server or browser tab was started.
