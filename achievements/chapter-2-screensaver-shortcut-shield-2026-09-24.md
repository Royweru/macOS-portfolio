# Chapter 2 — Screensaver Shortcut Shield

**Status:** Shortcut shielding implemented and unit-verified across manager and window capture paths; live screensaver interaction remains unverified.

The window manager had a separate global Ctrl/Cmd+W and Ctrl/Cmd+M listener that remained active behind the screensaver. `App.tsx` disables that listener while the saver is active, and the shared close/minimize shortcut policy refuses both shortcuts when disabled. A follow-up audit found a second Ctrl/Cmd+W handler inside `Window97` that bypassed the manager flag; the same enable gate is now threaded into every window and applied to that local capture too.

**Files:** `src/App.tsx`, `src/wm/WindowManager97.tsx`, `src/wm/Window97.tsx`, `src/wm/window-close97.ts`, `src/wm/window-close97.test.ts`.

**Evidence:** Original focused tests passed (2 files, 8 tests); follow-up focused tests pass (2 files, 9 tests). Current full validation: TypeScript, lint, 64 test files / 245 tests, and Webpack production build. The build emitted the existing stale Browserslist database notice. Tests verify disabled shortcuts are not prevented and do not confirm, close, or minimize. No live browser test was performed; localhost remains stopped.

**Plan:** `plans/weru97-screensaver-shortcut-shield-2026-09-24.md`.
