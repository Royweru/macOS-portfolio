# Weru 97 Boot Source Contract — 2026-09-24

## Goal

Make the active React boot sequence measurably traceable to `Stitch Designs/html/windows_97_boot_screen.html` without copying the embedded desktop or restoring Microsoft branding. Preserve the requested Weru 97 name and full-viewport layout.

## Work completed

- Moved the active BIOS copy, computed reveal delays, memory-test values, and stage/progress timings into `src/boot/boot-contract97.ts`; `BootSequence97` now consumes those values rather than duplicating them inline.
- Added `src/boot/boot-source-contract97.test.ts`, which reads the preserved source and checks:
  - all ten BIOS lines and their source order;
  - source-derived stagger timing, memory target/step/interval, BIOS and Starting durations;
  - 18 progress segments, 120ms cadence, 350ms reveal delay, and the 700ms Stitch script removal timer versus the 800ms CSS fade that Weru now honors;
  - exact ordered SVG path/rectangle attributes for the four-color flag;
  - full-viewport sizing, splash gradient, cloud and flag geometry, progress dimensions, CRT raster dimensions, and 45px bottom-left Starting placement.
- Corrected the flag SVG to retain the source root `fill="none"` and split the two highlight strokes into their original separate paths. This avoids the default SVG fill painting unwanted black shapes beneath the highlight strokes.
- On 2026-09-26, consolidated duplicate active base rules for the full-screen overlay, skip control, BIOS panel, and BIOS line container; retained the deliberate mobile BIOS override and removed an obsolete cursor selector from reduced-motion CSS.
- Updated the Chapter 2 Phase 10 tracker and Stitch manifest. The overall boot-state parity task remains `[~]` because static source contracts do not prove rendered visual parity.

## Verification

- Focused boot tests: 2 files, 7 tests passed.
- Full suite: 48 test files, 194 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed. Next.js reports the existing stale Browserslist database warning.
- `git diff --check`: passed; Git reported line-ending normalization warnings only.
- No localhost server was started and no live browser capture was made in this slice.
- Follow-up cascade cleanup: 69 test files / 324 tests passed; TypeScript, repository lint, production build, and `git diff --check` are recorded in `plans/weru97-boot-css-cascade-cleanup-2026-09-26.md`.

## Still open

- Capture BIOS, Starting, splash, progress, and shell transition at matched viewport dimensions in the authorized browser preview.
- Verify asset preload gating, reduced-motion flow, skip behavior, and absence of desktop flash through a live run.
- Keep the Stitch manifest's visual and functionality statuses partial until those runtime checks are performed.
