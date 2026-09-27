# Chapter 2 — Media Player Satellite Surfaces (2026-09-24)

## Delivered

- Corrected a source-extraction mismatch: the Stitch Compact Player and Codec Notice now live in the shell overlay plane, rather than inside the clipped Media Player content surface.
- Matched the source's desktop-relative satellite anchors, adapted the notice's bottom offset to remain above Weru's taller taskbar, added narrow-viewport edge/width guards, and preserved shared playback state.
- Added pointer-captured compact-window dragging constrained to the shell layer and separate minimize/close controls.
- Registered the shell layer through an external store so the portal attaches and detaches without synchronous effect state updates.

## Files changed

- `src/apps/media-player/MediaPlayer97.tsx`
- `src/apps/media-player/MediaPlayer97.test.ts`
- `src/styles/stitch97.css`
- `src/shell/dialog-layer97.ts`
- `src/shell/dialog-layer97.test.ts`
- `src/shell/Shell97.tsx`
- `src/data/stitch-screen-manifest.ts`
- `plans/weru97-media-player-satellite-surfaces-2026-09-24.md`
- `plans/weru97-chapter-2-task-list.md`

## Verification and limits

- Full suite: 38 files, 147 tests passed.
- TypeScript, lint, and production build passed; the existing stale Browserslist notice remains.
- No live browser or matched-viewport test was run, so the media screen remains partial in the manifest. Localhost remains stopped.
