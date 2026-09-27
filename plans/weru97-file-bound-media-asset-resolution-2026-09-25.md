# Weru 97 — File-Bound Media Asset Resolution

## Objective

Ensure that a Media Player window opened for a specific project file can only load that file's media. It must not briefly inherit a previously selected global asset while its IndexedDB/VFS lookup is pending.

## Implementation

- Map a VFS node's media metadata to the shared `MediaAsset` shape.
- For a window with `fileId`, return media only when the loaded VFS node has that exact ID; unresolved or mismatched nodes remain empty until the correct lookup completes.
- Preserve the global fallback only for player windows that were opened without a file association.
- Keep actual playback as a separate acceptance item: correct source resolution does not prove browser decoding or playback.

## Verification

- Focused regression tests cover every seeded project demo, unresolved lookup, mismatched node, matching node, and the unbound-player fallback.
- Current-worktree gates passed on 2026-09-25: TypeScript, lint, 61 test files / 235 tests, and production build. The build reports the existing stale Browserslist-data warning.
- Live browser playback remains unverified; do not interpret this source-selection fix as proof that the reported Media unavailable state is resolved.
