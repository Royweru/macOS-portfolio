# Chapter 2 — Window Resize Hit-Area Improvement (2026-09-26)

## Delivered

- Enlarged invisible edge resize targets to 8px and corner targets to 12×12px while preserving visible Stitch frame geometry.
- Added a regression check for resize-layer hit testing and pointer-handler connections; existing resize math tests continue to cover all eight directions, origin boundaries, and minimum-size anchors.

## Verification

- Focused resize/window tests: 2 files, 41 tests passed.
- Full suite: 69 files, 325 tests passed.
- TypeScript, lint (216 configured files), and production build passed.
- `git diff --check` passed before adding this entry and is rerun after all record updates.
- No browser tab was opened and no localhost server was started for this slice.

## Remaining

Live drag/resize testing for the remaining edges, corners, apps, and touch input remains open. This implementation improvement does not complete the broader Chapter 2 window-control matrix.
