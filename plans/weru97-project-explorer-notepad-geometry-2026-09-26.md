# Weru 97 Project Explorer + Notepad Geometry — 2026-09-26

## Source findings

The retained Stitch screen `Stitch Designs/html/windows_97_project_explorer_and_notepad_view.html` defines two overlapping project-work windows:

- Explorer: `left: 88px`, `top: 26px`, `width: 90vw`, `max-width: 620px`, `height: 430px`.
- Notepad: wide layout `(320px, 90px)`, narrow layout `(180px, 110px)`, `width: 95vw`, `max-width: 580px`, `height: 450px`; the position switches at the source's `md` breakpoint (768px).

The first-open size had already been source-matched, but the active app used generic centering and did not reproduce these authored anchors.

## Implementation

- Added source-backed `getStitchProjectExplorerRect97()` and `getStitchProjectNotepadRect97()` helpers.
- Project-folder Explorer launches now use Stitch's Explorer anchor and 90vw/max-620 width rule. Existing named root, Projects, and My Documents Explorer states retain their dedicated geometries.
- Documents seeded directly into project folders now open at the Stitch Notepad anchor and 95vw/max-580 width rule; unrelated personal/system Notepad documents keep their existing placement.
- Additional project windows cascade by 44px and all rectangles pass through the shared live-viewport clamp, so source placement never hides a window beyond the taskbar or browser edge.
- Added regressions that parse the original HTML for the anchors and CSS widths, assert exact wide-viewport rectangles, cascade positions, and narrow-viewport clamping.

## Verification and limits

- Focused geometry/store tests: 3 files, 49 tests passed.
- TypeScript validation passed after the code change.
- Full current-worktree suite passed: 68 files / 316 tests; lint and production build also passed.
- Matched-viewport visual comparison and live pointer/open workflow remain open; the test proves source values and routing geometry, not screenshot-level parity.
