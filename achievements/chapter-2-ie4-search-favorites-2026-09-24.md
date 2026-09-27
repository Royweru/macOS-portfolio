# Chapter 2 — IE4 Search and Favorites

**Status:** Implemented and automated checks pass; actual new-tab behavior and matched-viewport parity remain unverified.

The IE4 Search control now opens an encoded HTTPS web search in a separate browser tab, and Favorites opens a source-style classic menu of real profile/project links. The closed toolbar's geometry is unchanged, links use safe top-level targets, and no fictional Stitch destinations were copied.

**Files:** `src/apps/ie4/RetroBrowser97.tsx`, `src/apps/ie4/ie-search97.ts`, `src/apps/ie4/ie-search97.test.ts`, `src/apps/ie4/RetroBrowser97.test.ts`, and scoped IE4 styles.

**Evidence:** Focused tests passed (2 files, 6 tests). Full gates passed: TypeScript, lint, 33 test files / 134 tests, and production build. The build emitted the existing stale Browserslist database notice. No live browser interaction was performed; localhost remains stopped.

**Plan:** `plans/weru97-ie4-search-favorites-2026-09-24.md`.
