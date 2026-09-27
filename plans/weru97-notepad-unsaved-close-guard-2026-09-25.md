# Weru 97 — Notepad Unsaved-Close Guard (2026-09-25)

## Purpose

Make the dirty-document check consistent across title-bar close, title-bar context-menu close, and Ctrl/Cmd+W. Notepad publishes its dirty state on a nested editor element, so the window shell must search the rendered window content rather than expect the marker on the content wrapper itself.

## Implementation

- Add `hasUnsavedChangesInWindow97()` as the shared descendant-marker query.
- Use it in both `Window97` and the `WindowManager97` keyboard shortcut path.
- Add unit coverage for a nested dirty marker, a clean content tree, and missing content.
- Keep the Chapter 2 task partial until a live edit → close → Cancel/confirm interaction is verified.

## Verification boundary

Focused window suites passed (2 files / 11 tests), the full Vitest suite passed (64 files / 247 tests), TypeScript passed, lint passed, and `npm run build -- --webpack` passed with only the existing stale Browserslist-data advisory. `git diff --check` passed; Git printed its existing LF-to-CRLF normalization notices.

Unit tests verify the shared selector contract, not a rendered browser interaction. Do not claim live Notepad confirmation, Escape behavior, or the all-application close matrix from this slice. No local server was started for this work.
