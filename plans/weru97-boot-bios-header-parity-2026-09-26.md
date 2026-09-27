# Weru 97 Boot BIOS Header Parity — 2026-09-26

## Scope

Correct source-backed layout and compositing mismatches in the BIOS stage of `BootSequence97`, preserving the retained Stitch HTML and the user-requested Weru 97 brand adaptation.

## Findings and changes

- The Stitch `.bios-header` is a flex row with default stretch alignment. Its Energy Star badge therefore stretches to the full header height. Weru had explicitly used `align-items: flex-start`, leaving the badge visibly shorter; the active rule now explicitly uses `stretch`.
- Stitch's BIOS header text column uses ordinary block flow. Weru had changed it to a grid with an extra 2px row gap; it now uses `display: block` to retain source line spacing.
- Stitch's CRT raster layer is above the skip hint (`z-index: 100` vs `90`). The corresponding layers inside Weru's boot stacking context now preserve that order (raster `3`, skip `2`).
- Added a source-contract test covering those alignment and layer relationships.

## Verification

- `npx vitest run src/boot/boot-source-contract97.test.ts src/boot/boot-sequence97.test.ts src/boot/boot-transition97.test.ts` — passed, 3 files / 14 tests.
- Full current-worktree gates also passed: `npm test -- --run` (69 files / 326 tests), `npx tsc --noEmit --incremental false`, `npm run lint` (216 TypeScript files / 27 batches), and `npm run build` (only the existing stale Browserslist database warning).
- This verifies source/CSS contracts, not a rendered or live boot screenshot. Matched-stage browser comparison, preload timing, reduced-motion behavior, and full interactive boot acceptance remain open in the Chapter 2 task list.
