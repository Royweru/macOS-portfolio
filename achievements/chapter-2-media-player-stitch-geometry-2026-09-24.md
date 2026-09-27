# Chapter 2 — Media Player Source Geometry (2026-09-24)

## Delivered

- Compared the local Stitch source contract and the two geometry registries. The active window geometry (`WINDOW_CONFIGS`) was already 640×520, but descriptive `APP_REGISTRY.defaultWindow` metadata incorrectly said 820×560. The same manual duplication had drifted for several other apps.
- Changed the descriptive app catalog to derive each size from `WINDOW_CONFIGS` and typed its IDs against the active `WindowId` set. A test now checks every registered entry. This is a source-of-truth consistency fix, not a change to live window sizes.
- Recorded the finding and its limits in `plans/weru97-media-player-stitch-geometry-2026-09-24.md`.

## Verification

- Focused registry and codec preference tests: 2 files, 5 tests passed before the catalog-wide derivation; the updated registry test also passes (1 file, 3 tests).
- Full suite: 26 files, 110 tests passed.
- TypeScript: `npx tsc --noEmit` passed.
- Lint: `npm run lint` passed.
- Production build: `npm run build` passed; only the existing stale Browserslist data advisory was reported.
- `git diff --check` passed.

## Still open

- Compare the active player screenshot with the raw Stitch screen at a matched viewport and verify that 640×520 remains usable at narrow viewports.

## Correction — 2026-09-25

The 640×520 source-height claim above was incorrect. A Chromium measurement of the retained Stitch screen found 640×396 outer bounds at 1280×580. The active config and prior-default migration have been corrected; see `plans/weru97-media-player-source-geometry-correction-2026-09-25.md`. The live matched-viewport comparison remains open, so this achievement records only the original registry-catalog change, not completion of Media Player visual parity.
