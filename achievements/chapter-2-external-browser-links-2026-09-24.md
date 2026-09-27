# Chapter 2 — External Browser Links

## Completed

- Added a shared external anchor that only permits HTTP(S), opens with `target="_blank"`, isolates the destination with `noopener noreferrer`, and explains that the link leaves Weru 97.
- Applied it to README/Markdown previews, project repository/live links, IE4 quick links/favorites/directory, and Contact social links.
- Kept typed IE addresses and VFS `.url` files on the synchronous top-level-tab handoff path; external pages are not rendered inside the simulated IE surface.
- Kept in-OS navigation for Weru's home page and local Markdown document links.
- Added a visible safe “Open in browser” status-bar retry after typed IE address handoff, for cases where the browser blocks a scripted new-tab request. The wording explicitly distinguishes the visitor's normal browser from simulated IE.

## Verification

- Focused external-link/README/IE4 handoff tests pass; the full suite now passes at 59 files / 229 tests. TypeScript, lint, production build, and `git diff --check` pass.
- The build reports the existing stale Browserslist database warning.
- No localhost server or browser UI was started for the retry-link change.

## Remaining

- A published deployment still needs to be updated and verified; the known live deployment was stale during the prior audit.
- Browser settings determine tab versus window, and may block scripted external handoffs. This behavior was not manually tested in a browser for this change.
- 2026-09-25 follow-up: retry wording and status message updated; focused render regression passes. This does not change the browser-controlled tab/window behavior or prove the published bundle is current.
