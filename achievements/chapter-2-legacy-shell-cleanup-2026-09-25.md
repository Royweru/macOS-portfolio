# Chapter 2 — Legacy Shell Cleanup (2026-09-25)

## Delivered

- Removed the unreachable macOS Dock/MenuBar/Spotlight/Sidebar/parallax path, old Desktop/Window and ViewControls components, obsolete Windows 11 taskbar/Start/Quick Settings modules, and the legacy snap engine/work-area hook after a source-reference audit.
- Removed their disconnected stylesheet files and dead snap/menu/sidebar/dock compatibility API, while preserving the active `useWindowManager` bridge and all `Shell97`, `Window97`, OS-store, and application routes.
- Rewrote the root README around the actual Next.js/Weru 97 structure and labeled the original Windows 11/macOS migration snapshot as historical.
- Updated the Chapter 2 checklist to **138 verified / 37 partial / 0 unchecked**; remaining visual/runtime tasks are still explicitly partial.

## Verification evidence

- Full test suite: 67 files / 306 tests passed.
- TypeScript, ESLint, and production build passed.
- `git diff --check` reported no whitespace errors for the cleanup records; Git reports normal LF-to-CRLF working-copy warnings on Windows.

## Not claimed

- No live browser check or deployment was performed.
- No matched-viewport Stitch parity is proven by removing dead code.
- The all-app mouse/touch/keyboard window-control matrix, boot comparison, and remaining visual acceptance tasks remain open in the Chapter 2 checklist.
