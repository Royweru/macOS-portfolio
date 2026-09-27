# Media Player failure feedback — 2026-09-24

## Evidence and scope

The project video assets exist under `public/media/videos/`; filesystem regression tests confirm the project nodes carry the expected MP4 sources and route to Media Player. FFprobe reports H.264/yuv420p video for the bundled demos. However, there is no existing Weru browser tab to reproduce the user's reported failure, and localhost remains stopped. This change improves diagnostics; it does not assert that playback is now fixed.

## Changes

- Map HTML media errors to distinct user-facing statuses: network, decode, unsupported format, interrupted playback, policy-blocked playback, and unknown failure.
- Show the explanation over the failed video surface instead of leaving a silent black stage.
- Offer a safe `_blank` link to the original file only for recognized bundled `/media/videos/` sources. Arbitrary/unapproved source URLs never become clickable through this fallback.
- Clear the failure state when a different asset is selected or valid metadata loads.
- Add pure failure-mapping tests, fallback markup/security tests, and a project-video element render test.

## Verification

The focused Media Player and filesystem regressions passed. Final gates passed: 41 test files / 157 tests, `npx tsc --noEmit`, `npm run lint`, and `npm run build`. The build emitted only the existing stale Browserslist database notice. No localhost server was started and no browser tab was created.

## Remaining

The original playback failure still requires a live browser reproduction against the current player code. A Chrome tab at the deployed Vercel URL is available, but its current desktop does not have the affected media player open and the published README asset differs from this worktree. The four video files are reachable with matching content lengths, and Gigaclaw supports byte ranges; these checks do not prove browser decode/playback. The standalone link opens the file in a new tab in the same browser; it cannot select another installed browser or overcome a browser that lacks the required codec. Actual playback, reduced-motion behavior, and end-state acceptance remain partial. No local server was started.
