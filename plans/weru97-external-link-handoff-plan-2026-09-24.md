# Weru 97 — External Link Handoff (2026-09-24)

## User-facing rule

Websites outside the Weru 97 portfolio open as top-level pages in a new browser tab. Weru 97 stays in its original tab; it does not load external sites into the simulated IE window or an iframe. Internal filesystem and app navigation continue inside Weru 97.

## Covered entry points

- IE4 home-page links are ordinary anchors using `target="_blank"` and `rel="noopener noreferrer"`.
- README preview links use the same direct-anchor behavior; they no longer call the OS window router.
- Project Repository and Live Project links already use safe new-tab anchors.
- `.url`/`text/uri-list` VFS entries resolve to an external target and are handed off synchronously before any async filesystem resolution, preserving the user click's popup permission.
- URLs entered in IE4's address field open a new tab rather than loading an in-app preview.
- IE4 Search encodes a non-empty query and hands it to a top-level Google results tab; the Favorites popover links directly to the real profile/project destinations in separate tabs.
- Linked Adventures and MoniePal README assets use the actual URLs from `PROJECTS.live`, not placeholder strings. The README-preview regression renders each configured destination as a safe new-tab anchor.
- When IE4 is initialized with an external address, it presents a handoff prompt with an explicit new-tab link rather than a simulated external-page view.
- Only `http:` and `https:` URLs are allowed; unsafe schemes are rejected or rendered inactive.

## Browser limitations and fallback

The operating system cannot force which browser application handles `_blank`; the user's current/default browser decides. Link anchors use native top-level navigation. Address-field handoff is initiated synchronously from the Enter/Go action; a browser can still block a new tab based on its settings, and the page cannot reliably confirm that the tab actually opened. External sites retain their own framing, cookie, login, and navigation behavior because they are top-level pages.

## IE4 Stitch source follow-up (2026-09-24)

- Restore the source's 18px Quick Links strip below the address row and the animated globe badge beside the toolbar. Keep Mail as the additional user-required IE action.
- Rebuild the source's external-link directory as a two-column raised-button grid, including its heading, protocol label, visitor odometer, compatibility badges, and page footer.
- Use only destinations from `PROFILE` and live project URLs from `PROJECTS`; do not copy the Stitch sample's fictitious email, GitHub, LinkedIn, X, Dribbble, or demo addresses.
- Route the Email card into Outlook Express; route real web destinations to a separate top-level tab.
- Keep IE visual parity partial until a matched-viewport live comparison is captured. Raw Stitch HTML remains unchanged.

## Verification

- Tests assert there is no iframe in IE4 output, safe `target="_blank"` links appear on IE4 and Markdown, unsafe schemes are rejected, and the shared opener requests `_blank` with `noopener,noreferrer`.
- IE4 render tests cover the Quick Links strip, local globe badge, real directory/profile destinations, project live links, and the internal Outlook Express mail action; the Stitch HTML is retained as the source reference.
- IE4 search helper tests cover query encoding, empty input, and HTTP(S) safety; toolbar-render checks ensure Search/Favorites controls remain present without placeholder-unavailable text.
- Final workspace gates passed: TypeScript, lint, 34 test files / 138 tests, and production build. The build reports the existing stale Browserslist database notice.
- One existing Chrome tab was reused to inspect the deployed portfolio. Its restored Explorer/Notepad state showed the currently deployed README still has placeholder text, demonstrating that a future deployment is needed for workspace content changes to appear publicly. No extra tab was created and localhost remains stopped; popup behavior remains a manual acceptance item.
