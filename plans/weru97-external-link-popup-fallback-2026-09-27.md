# Weru 97 External Link and Popup Fallback — 2026-09-27

## Goal

Make safe external links in README previews and other shared surfaces leave the simulated OS in a detached, no-referrer browser tab. If the browser blocks the new tab, leave the visitor an explicit retry link rather than a dead-looking anchor.

## Implementation

- `ExternalBrowserLink97` now routes ordinary link activation through `openExternalUrlInNewTab`, which opens `about:blank`, applies `no-referrer`, clears `opener`, and navigates to the validated HTTP(S) URL.
- The React click handler composes with caller-provided click handlers and respects any caller that already prevented the action.
- A blocked popup renders a small classic-beveled alert with a plain retry link and a dismiss button. Right-click/open-link actions still retain the anchor `href`, `_blank`, and `noopener noreferrer` attributes.
- The click policy lives in `src/components/external-browser-navigation97.ts`, separate from the React component module to satisfy Fast Refresh lint constraints.

## Verification

- Focused tests: 2 files / 11 tests passed; they cover successful handoff, blocked popup reporting, pre-cancelled event preservation, safe URL markup, and README link markup.
- Full suite after the final refactor: 70 files / 346 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed all 220 TypeScript files.
- `npm run build`: passed; only the existing stale Browserslist database notice.
- Browser-extension QA: the README's Adventures link was observed opening `https://travelicious-rose.vercel.app/` outside Weru 97. Repeated diagnostic clicks produced two destination tabs, so the exact one-click/tab-count relationship was not isolated. The live blocked-popup state was not induced; its fallback branch is unit-tested. A 2026-09-29 follow-up after foregrounding README verified one deliberate Enter activation opened exactly one tab at https://travelicious-rose.vercel.app/, loaded the page, and left Weru at localhost:3001. The extension refused closing that test tab, which remained open. This supersedes the unresolved single-activation/tab-count note for README only; other routes and popup blocking remain unverified.
- The temporary local server on port 3001 was stopped after the browser check. No email was sent and no deployment was performed.

## Remaining

- Verify pointer activation separately from the keyboard path, and induce a blocked-popup condition in a safe context to inspect the retry/dismiss strip. The exact one-tab result is now verified for one README Enter activation.
- Induce a blocked-popup condition in a safe test context and visually verify the retry/dismiss strip.
- Recheck the public deployment only after the user authorizes a release; do not deploy from this task.
