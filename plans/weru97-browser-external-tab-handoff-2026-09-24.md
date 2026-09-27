# Weru 97 External Browser Handoff (2026-09-24)

## Goal

Keep remote destinations outside the simulated Weru Internet Explorer. When a visitor chooses an external HTTP(S) link or submits an external address, open that destination in a normal browser tab while leaving the portfolio OS available.

## Behavior contract

- IE4 home, Favorites, project, and rendered Markdown HTTP(S) links open with native `_blank` anchors and `rel="noopener noreferrer"`.
- Explorer `.url`/URI-list targets use the shared external-target handler and open a top-level browser tab before asynchronous filesystem work can lose the user's click gesture.
- Submitting an HTTP(S) address from the simulated IE opens a separate browser tab; IE remains on the Weru home page and does not show a fake remote-page view.
- The simulated IE history represents pages actually shown inside the Weru browser. External destinations use the new tab's browser-native history instead.
- Only valid HTTP(S) URLs may be handed off. Internal Weru routes remain inside the OS.
- Browser security does not let a website force a URL into a specific installed browser application; `_blank` means a new tab/window in the user's configured browser.

## Implementation and verification

- Updated `src/apps/ie4/RetroBrowser97.tsx` to keep externally supplied initial addresses on the local Weru home surface and to hand off typed HTTP(S) addresses without changing the simulated page or its history.
- Removed the faux external-page presentation styles from `src/styles/stitch97.css`.
- Updated the IE regression test to ensure an external initial address never renders an external-site placeholder and that the safe new-tab destination remains available.
- Focused tests: `RetroBrowser97.test.ts`, `open-target.test.ts`, and `MarkdownPreview97.test.ts` passed (3 files, 14 tests).
- `npx tsc --noEmit` passed; `npm run lint` passed; `git diff --check` passed (Git emitted only existing LF-to-CRLF normalization warnings).
- No localhost server was started and no browser tab was opened for this change.

## Still outstanding

- Focused recheck on 2026-09-24: `open-target`, `ExternalBrowserLink97`, `RetroBrowser97`, and `MarkdownPreview97` tests pass (4 files / 16 tests). This validates the current source contract, not browser popup behavior.

- A user click on the published IE4 “Open in a new browser tab” anchor was verified on 2026-09-24: the browser inventory showed a new MoniePal tab while Weru remained listed immediately afterward. This proves that published anchor behavior only.
- The published `.url` path still enters the legacy simulated IE preview before that anchor; direct external routing from the current worktree and a rendered README hyperlink have not been live-verified because the deployment is stale and localhost remains stopped.
- The browser extension refused cleanup of the test tab and its next inventory no longer listed the prior Weru tab. The resulting browser state is uncertain, so no further browser actions were taken. See `plans/weru97-live-external-tab-verification-2026-09-24.md`.
- Verify popup behavior for the current worktree bundle and after an authorized release, including direct `.url` and README-link routes.

## 2026-09-25 current-source review

- Re-read the production click paths: README/project/IE links are native safe `_blank` anchors; the shared App handler opens VFS external targets before its first `await`; typed external IE addresses call the same synchronous handoff and leave the in-OS page/history unchanged.
- Re-ran the focused routing and rendering suite: 9 files / 36 tests passed (`open-target`, `ExternalBrowserLink97`, IE4, Markdown preview, Notepad, and filesystem routing/seeding).
- This confirms current source behavior, not the currently deployed bundle. No localhost server was started and no live browser tab was opened; production popup/current-build verification remains outstanding.
- Full current-worktree gates were re-run on 2026-09-25: 66 test files / 304 tests, lint, TypeScript, and production build all passed. This does not change the separate stale-deployment finding or substitute for a live popup check.
