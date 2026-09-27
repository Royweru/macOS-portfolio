# Weru 97 Window Resize Hit-Area Improvement (2026-09-26)

## Goal

Make all eight window resize handles easier to target without changing the visible window frame or its Stitch-derived geometry. This responds to the earlier live east-edge resize attempt that produced no visible width change.

## Change

- Set north/south edge targets to 8px high and east/west edge targets to 8px wide.
- Set corner targets to 12×12px, with straight-edge zones inset so corners remain independently targetable.
- Keep the handles above app content with pointer events enabled; retain touch-safe pointer handling and existing resize math.
- The change is invisible and does not alter titlebar, border, frame size, or app layout.

## Verification

- `src/wm/Window97.test.ts` checks the rendered eight-handle set, touch-safe styles, edge/corner dimensions, hit-layer CSS, and pointer-handler wiring.
- `src/wm/useResize97.test.ts` covers all eight resize directions, origin limits, and minimum-size anchoring.
- Focused tests: 2 files, 41 tests passed.
- Full tests: 69 files, 325 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed for all 216 configured TypeScript files.
- `npm run build`: passed; the build reports the existing stale Browserslist data warning.
- `git diff --check`: passed before this record was added; rerun after documentation updates.

## Still open

No live browser resize was performed in this slice. The per-app mouse/touch interaction matrix remains partial in `plans/weru97-chapter-2-task-list.md`; this change only improves the target area and protects its wiring with regression tests.
