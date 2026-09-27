# CD Player tray state and status bar

Translated two visible behaviors from Stitch screen `47dfc46a772046c183e86027164941c5`: Eject now opens the yellow CD-ROM tray notice even with no audio loaded, and its separate Close Tray action returns the simulated drive to No Disc. Eject pauses/releases any active selection, and selecting another track closes the tray. The main CD Player now has Stitch's separate 18px three-compartment total-time / track-time / drive-status strip.

Source, transition, and rendered-surface regressions pass; focused CD tests passed (4 files / 12 tests). Full repository gates also passed: TypeScript, lint, 57 test files / 219 tests, production build, and `git diff --check` (line-ending normalization warnings only). The build emitted the existing stale Browserslist-data warning. No browser was started, so matched-viewport parity and actual audio playback remain unverified.

Plan: `plans/weru97-cd-tray-status-2026-09-24.md`.
