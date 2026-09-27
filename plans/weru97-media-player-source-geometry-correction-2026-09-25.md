# Weru Media Player Source Geometry Re-audit — 2026-09-25

## Correction

The earlier 640×520 claim came from the existing implementation, not from a measured Stitch reference. Reopening the retained `windows_97_media_player_6.4.html` in Chromium at a 1280×580 viewport (DPR 1.5) showed the source-authored main window at **640×396**, positioned at **(80,56)**. Its height is content-driven. This source measurement supersedes the 640×520 estimate recorded in the 2026-09-24 catalog cleanup.

## Changes recorded

- Set the active Media Player default to the measured 640×396 bounds.
- Add a narrow OS-state migration for old Media Player windows whose default and optional restore rectangles are exactly 640×520. Preserve custom window dimensions and unrelated profile/filesystem state.
- Bump the persisted OS-state schema to v22 and derive the descriptive app catalog from `WINDOW_CONFIGS`.
- Add source-bound geometry and migration regressions.

## Verification at this stage

- Focused source, registry, and OS-state tests passed: 4 files, 54 tests.
- `npx tsc --noEmit` passed.
- A live local render then revealed that the first 640×396 implementation still overran its content viewport: the generic screen margin, oversized playlist footer buttons, and row padding needed their own source-specific correction. That follow-up is documented in `weru97-media-player-source-geometry-correction-2026-09-26.md`.
- Full-page matched-view comparison and media interactions remained open.

This record corrects source geometry; it does not claim that the whole Media Player screen was complete.
