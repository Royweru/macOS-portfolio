# Chapter 2 Achievement — Notepad Close Dialog

**Date:** 2026-09-28  
**Scope:** Chapter 2, Phases 3, 6, and 12 — dirty document close safety

Replaced Notepad's browser-native confirmation with a classic in-shell Win97 modal. Live QA caught and fixed a pointer-down bubbling bug that made title-context-menu actions disappear before their click could fire. Title-bar X, context-menu Close, and Ctrl+W all now open the prompt; Cancel preserves the draft, and “Close Without Saving” closes it. The original Skills document was reopened with its persisted text intact. No test edit was saved. Full gates passed: 71 files / 347 tests, TypeScript, lint across 222 files, production build, and `git diff --check` (with existing line-ending notices). The broader Save/Save As, Find, and clipboard workflow remains open.

See `plans/weru97-notepad-close-dialog-2026-09-28.md`.
