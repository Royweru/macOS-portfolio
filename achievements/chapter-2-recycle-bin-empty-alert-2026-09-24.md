# Chapter 2 — Recycle Bin Stitch Empty Alert

**Status:** Source-derived UI and action gating implemented; matched-viewport and live interaction verification remain partial.

The retained System Dialogs source's floating Recycle Bin alert is now portaled to a shell-level dialog layer at the bottom-right of the taskbar-safe desktop, not rendered inside/clipped by the Recycle Bin app window. It has its own title bar, info icon, source message, Close/OK buttons, and Escape dismissal. The irreversible Empty/Delete confirmation remains separate and must succeed before this alert appears. Deleting the final item also triggers it; opening an already-empty bin does not force a modal.

**Files:** `src/windows/RecycleBinContent.tsx`, `src/apps/recycle-bin/RecycleBinEmptyAlert97.tsx`, `src/apps/recycle-bin/recycle-bin-actions97.ts`, `src/apps/recycle-bin/RecycleBinEmptyAlert97.test.ts`, `src/shell/Shell97.tsx`, `src/shell/Shell97.test.ts`, and scoped shell/Recycle Bin styles.

**Evidence:** Focused tests passed after the layer correction (2 files, 3 tests). Fresh full verification after the correction passed TypeScript, lint, 32 test files / 131 tests, and production build; the build emitted the existing stale Browserslist database notice. No localhost/browser visual check was performed.

**Plan:** `plans/weru97-recycle-bin-empty-alert-2026-09-24.md`.
