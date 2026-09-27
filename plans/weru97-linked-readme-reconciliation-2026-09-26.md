# Linked README Reconciliation — 2026-09-26

## Goal

Keep each generated project `README.md` as a link to the Markdown asset named by `PROJECTS[].readme`, rather than leaving synthetic inline text from an older seed in the persisted VFS.

## Change

- Audited the active `seedFilesystem()` → `migrateWin97Layout()` path and confirmed it reconciles canonical system nodes on startup.
- Extracted `mergeSeededTextAsset97()` so a generated node always takes its current manifest URL and metadata.
- Preserve cached Markdown only when the cached node has the exact same `contentUrl`; stale inline text or a cache from a different asset is discarded.
- Left user-created VFS files untouched; reconciliation applies only while writing the canonical generated system nodes.
- Added regressions for old inline README content, matching fetched cache, and stale-URL cache.

## Verification

- Focused filesystem / Notepad / Markdown tests: 3 files, 21 tests passed.
- Full suite: 68 files, 318 tests passed.
- `npx tsc --noEmit`: passed.
- ESLint on both changed TypeScript files: passed.
- `npm run build`: passed.

## Remaining evidence

An affected persisted browser profile was not opened or reset during this change, so visual proof of the reload repair remains open. No Stitch screen or overall Chapter 2 phase is marked complete by this task.
