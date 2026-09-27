# Weru 97 External Browser Link Behavior

## Goal

Make it unambiguous that project and portfolio links leave the Weru 97 shell and open through the visitor's normal browser, rather than loading an external site inside the simulated Internet Explorer window.

## Implementation

- Add `ExternalBrowserLink97` as the shared anchor for external HTTP(S) destinations.
- Reject non-web protocols by rendering inert text rather than a clickable anchor.
- Set `target="_blank"` and `rel="noopener noreferrer"` consistently, with a title that explains the destination opens outside Weru 97.
- Use the shared anchor for rendered README/Markdown links, project repository/live links, IE4 quick links/favorites/directory cards, and Contact social links.
- Keep the existing synchronous `openExternalUrlInNewTab` route for typed IE addresses and VFS `.url` files. It runs before asynchronous filesystem resolution so it retains the click's user activation.
- After an IE address-bar handoff, show a visible native “Open in browser” anchor in the status bar as a retry when popup settings block the scripted request. Keep the safe HTTP(S)-only link component and `noopener noreferrer` isolation.
- Keep internal `weru://home`, page fragments, and local Markdown document links inside the OS.

## Browser/platform boundary

A website can request a new top-level browsing context. The visitor's browser decides whether that appears as a tab or a separate window; a website cannot select or launch a particular installed browser application. Browser popup settings can still block scripted `.url`/address-bar handoffs. This change does not deploy the updated source, and the previously observed production build remains stale until an authorized release.

## Verification

- Dedicated external-link tests verify safe URL attributes and that `javascript:` destinations are not clickable.
- Handoff status render tests verify the retry link is present only when a valid external destination is pending.
- README/Markdown and IE4 render tests verify outbound anchors remain separate-tab links and the IE content does not embed external pages.
- TypeScript, lint, the full suite (59 files / 229 tests), production build, and `git diff --check` pass. The build emits the existing stale Browserslist-data warning. No localhost server or browser UI was started for this slice.
- Manual production popup behavior remains unverified; validate after deployment using the existing browser session and a user-initiated click.

## 2026-09-25 clarity follow-up

- Renamed the retry action from “Open destination” to “Open in browser” and updated its status message, making clear that it leaves the simulated IE surface.
- The anchor remains a normal `_blank` top-level link. The visitor's browser selects tab versus window and the site cannot force a different installed browser.
- Updated the handoff render regression; live popup behavior and deployed-source verification remain open.
