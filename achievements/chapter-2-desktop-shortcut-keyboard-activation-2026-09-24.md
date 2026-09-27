# Chapter 2 — Desktop Shortcut Keyboard Activation (2026-09-24)

Focused desktop shortcuts now open on Enter through the same routing callback as mouse double-click. The handler suppresses the button's duplicate native activation and does not intercept unrelated keys. A regression test verifies both paths.

The deployed browser interaction remains unverified because the published experience differs from the worktree and localhost is stopped. TypeScript, lint, all 42 test files / 161 tests, and production build passed after this change. See `plans/weru97-desktop-shortcut-keyboard-activation-2026-09-24.md`.
