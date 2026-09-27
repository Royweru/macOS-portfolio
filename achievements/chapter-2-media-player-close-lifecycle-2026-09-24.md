# Chapter 2 — Media Player Close Lifecycle (2026-09-24)

## Delivered

- Explicitly pauses active audio/video when the selected source changes and when the Media Player component unmounts, preventing audio from continuing after its window closes.
- Added lifecycle regressions for mounted media and an absent media element.

## Verification

- Focused tests: 4 passed; full suite: 52 files / 203 tests passed.
- TypeScript, lint, and production build passed; build emitted the existing stale Browserslist warning. Diff check passed with line-ending normalization warnings only.
- Real browser playback/close is still unverified; the deployed player is stale and localhost was not started.
