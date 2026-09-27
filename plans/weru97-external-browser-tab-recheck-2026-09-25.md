# Weru 97 External Browser Tab Recheck — 2026-09-25

## Goal

Ensure a visitor clicking a public web link leaves the simulated Weru Internet Explorer surface and lands in a separate top-level page in their normal browser.

## Scope and current implementation

- README/Markdown and project/Contact/IE directory links use `ExternalBrowserLink97`, with HTTP(S)-only destinations, `_blank`, and `noopener noreferrer`.
- IE typed addresses and Explorer `.url` files use the synchronous `openExternalUrlInNewTab()` handoff so browser user activation is retained.
- A popup-blocked scripted handoff provides a native “Open in browser” link as a retry.
- Local `.md`/`.txt` document links intentionally remain within Weru and open in the document preview; they are not web redirects.

## Verification on 2026-09-25

- In the current-worktree local browser build (`http://127.0.0.1:3000/`), launched Internet Explorer and clicked its “GitHub Profile” link.
- The browser created a separate Chrome tab at `https://github.com/Royweru`; the original Weru page remained open at its local URL. The external page was only inspected, with no login or form action.
- Focused tests: 7 files, 24 tests passed. Coverage includes HTTP(S)-only URLs, isolated new-tab attributes, `.url` target resolution and opener security, IE fallback markup, README/Markdown external links, and IE's no-faux-remote-page behavior.

## Remaining limits

- This manual check verifies the IE anchor only. `.url`, typed address, project-detail, and README-link clicks still need current-build manual checks.
- The earlier public deployment audit is still applicable; this local check does not change or verify the deployed site.
- Normal websites cannot force a different installed browser application. `_blank` asks the visitor's current browser for a new top-level context; the browser decides tab versus window and may block scripted popups.
- The temporary localhost preview and Stitch source server should be stopped after the check.
