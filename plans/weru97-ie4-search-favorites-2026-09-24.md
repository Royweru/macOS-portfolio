# Weru 97 IE4 Search and Favorites

## Scope

Complete the visible Search and Favorites controls from the IE4 toolbar without changing its default Stitch-matched window geometry or keeping external websites inside the simulated browser.

## Behavior

- Search opens a classic query popover only when requested. Empty/whitespace queries are rejected with an inline status; non-empty text is URL-encoded and sent to Google over HTTPS through the shared popup-safe new-tab handoff.
- Favorites opens a classic menu of real PROFILE and PROJECTS destinations. Each external link is a top-level `_blank` anchor with `noopener noreferrer`; duplicated Quick Links are not repeated in the menu.
- Search and Favorites close each other when opened. The IE home view and toolbar keep their original default layout.

## Verification

- Search helper tests cover encoding, empty input, and HTTP(S) safety.
- IE render test confirms both toolbar controls are present and no longer advertise Search as unavailable.
- Full gates passed: TypeScript, lint, 33 test files / 134 tests, and production build. The build includes the existing stale Browserslist database notice.
- Actual external-tab behavior and matched-viewport visual comparison remain live-browser items; localhost was not started.
