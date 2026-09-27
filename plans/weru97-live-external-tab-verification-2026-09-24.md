# Weru 97 Live External-Tab Verification — 2026-09-24

## Scope

Verify that an external project link leaves the simulated Weru browser and opens a normal browser tab, without logging into or submitting anything to the destination.

## Observed behavior

- Used the existing Chrome extension tab at `https://weru97.live/`; did not start localhost or open another browser window.
- The published project `.url` file opened the legacy IE4 preview surface first.
- Clicking that surface's visible “Open in a new browser tab” link created a Chrome tab at `https://moniepal-two.vercel.app/login`.
- The immediate browser inventory showed the Weru tab at `https://weru97.live/` alongside the new destination tab. No credentials were entered, and no form was submitted.

## Result and limits

- The new-tab anchor is live-verified on the published deployment.
- The `.url` file's initial legacy preview behavior is not the direct handoff implemented in the current worktree. The updated source and README link behavior still need a current-build/deployment verification; keep the broader external handoff task partial.
- The browser control refused cleanup of the test tab. Its next inventory no longer listed the original Weru tab, so no claim is made about whether that tab closed or detached. No further browser actions were taken.

## Source evidence

- `src/apps/ie4/RetroBrowser97.tsx` renders external destinations as `_blank` anchors.
- `src/features/os/open-target.ts` validates HTTP(S) destinations and provides direct top-level tab handoff for OS targets.
- `src/App.tsx` hands external targets off before asynchronous VFS lookup.

No application files or production deployment were changed during this verification.
