# Weru 97 — Popup-Blocked External Link Recovery (2026-09-25)

## Goal

External HTTP(S) destinations must open as top-level browser pages, never inside the simulated IE or an OS window. If browser policy blocks a scripted tab request from an Explorer `.url` file or another OS route, Weru must retain the destination and offer a native safe-link retry.

## Implementation

- Detect popup blocking by opening a same-origin `about:blank` context synchronously during the user gesture.
- Before navigating externally, set a `no-referrer` document policy and detach `window.opener`; navigate only after those protections are in place.
- Return `false` for a blocked or failed popup request, rather than treating URL validity as proof that a tab opened.
- Show a classic, dismissible shell fallback with a real `_blank` / `noopener noreferrer` anchor for blocked VFS external targets.
- Keep the IE address-bar retry link available for both blocked requests and successful requests that the visitor cannot find; reject unsafe/non-HTTP(S) schemes without making them clickable.
- Clear an old fallback when the visitor continues into an internal Weru target or launches another external target.

## Verification

- Unit tests verify the safe navigation order (no-referrer policy → opener detached → external navigation), blocked-popup detection, unsafe-scheme rejection, and accessible native fallback markup.
- IE handoff tests verify that the retry remains visible when `window.open` reports a block.
- Full repository gates on 2026-09-25: 67 Vitest files / 306 tests, lint, TypeScript, and production build passed.

## Still outstanding

- Manual click verification against a current deployed or explicitly started current-worktree bundle. The published app remains stale; no deploy, localhost server, or browser tab was started for this change.
- Browser-specific popup behavior and matched-viewport IE Stitch comparison remain partial.
