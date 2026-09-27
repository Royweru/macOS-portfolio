# Chapter 2 — Project Explorer + Notepad Geometry (2026-09-26)

## Verified

- Project-folder Explorer launches use Stitch's `(88,26)` placement, 620×430 maximum geometry, and 90vw width rule.
- Project documents opened in Notepad use the wide `(320,90)` / narrow `(180,110)` source anchors, 580×450 maximum geometry, and 95vw width rule.
- Further project windows cascade, and narrow rectangles remain clamped inside the live work area.
- Tests parse the source HTML and verify the production routing/geometry helpers. Focused tests passed: 3 files / 49 tests; the full suite passed at 68 files / 316 tests; TypeScript, lint, and production build passed.

## Not claimed

- No matched-viewport screenshot comparison or live pointer workflow was performed in this slice.
- The project Explorer + Notepad Stitch screen remains visually and functionally partial until its remaining controls and screenshot comparison are verified.

See [`weru97-project-explorer-notepad-geometry-2026-09-26.md`](../plans/weru97-project-explorer-notepad-geometry-2026-09-26.md) for implementation details.
