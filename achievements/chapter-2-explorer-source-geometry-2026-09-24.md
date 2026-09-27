# Chapter 2 — Explorer source-specific geometry

**Date:** 2026-09-24  
**Plan:** `plans/weru97-explorer-source-geometry-2026-09-24.md`  
**Stitch sources:** `windows_97_project_explorer_and_notepad_view.html`, `windows_97_dual_explorer_windows.html`

Implemented location-specific first-open geometry: the main Explorer uses the source's 620×430 size, My Computer uses 440×320, Projects uses 660×440, My Documents retains 560×410, and Notepad remains 580×450. Added source-reading regression tests and updated the screen manifest to keep visual status partial pending a matched live capture.

**Evidence:** 40 test files / 153 tests passed; TypeScript, lint, and production build passed. The build reports the existing stale Browserslist database warning. No localhost runtime was started, so this record does not claim live visual verification.
