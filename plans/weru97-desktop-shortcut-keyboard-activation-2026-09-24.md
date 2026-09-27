# Weru 97 Desktop Shortcut Keyboard Activation — 2026-09-24

## Behavior

When a desktop shortcut button has keyboard focus, Enter opens it through the same `openShortcut()` route used by pointer double-click. The handler prevents the native button activation from firing a second time. Other keys are left untouched so normal focus navigation remains available.

## Implementation

- Added a small tested key-dispatch helper in `desktop-layout97.ts`.
- Connected the helper to every built-in and custom desktop shortcut button in `Desktop97`.
- Preserved mouse selection, drag, context-menu, and double-click behavior.

## Verification

- Regression test verifies Enter prevents default/propagation and invokes the open callback exactly once; a non-Enter key is ignored.
- TypeScript, lint, the full suite (42 files / 161 tests), and production build pass after this change.
- Live launch remains unverified: localhost is intentionally stopped and the deployed experience differs from this worktree.
