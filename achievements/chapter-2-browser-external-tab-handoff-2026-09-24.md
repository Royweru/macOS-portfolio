# Chapter 2 — Browser External-Tab Handoff (2026-09-24)

## Delivered

- Removed the simulated IE's faux external-page state. Weru IE remains on its home page instead of suggesting it loaded a remote destination.
- External HTTP(S) addresses submitted through IE are handed to a separate top-level browser tab; remote URLs are not recorded as pages rendered in the OS's simulated history.
- Kept project links, README Markdown links, IE directory/Favorites links, and VFS `.url` targets on safe separate-tab handoff paths.
- Added regression coverage for the home-page fallback when an external URL is supplied to the IE component.

## Verification

- Focused test run: 3 test files, 14 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed; Git reported only line-ending normalization warnings.
- No localhost process was started and no browser tab was opened.

## Remaining verification

- Rechecked the focused external-navigation suite on 2026-09-24: 4 files / 16 tests pass, covering safe anchors, IE home navigation, Markdown links, and external target handling.
- Browser-level click and popup-blocker behavior is not verified in this turn.
- A website can open a new tab/window in the current browser, but browser security does not permit it to launch a specific installed browser application.
- Verify against the current deployed build only after an authorized deployment; the existing deployment may be stale.
