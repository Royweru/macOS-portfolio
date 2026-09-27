# Weru 97 — Public Deployment Parity Audit (2026-09-25)

## Browser evidence

Used one Chrome extension tab at `https://weru97.live/` and inspected the rendered DOM without changing the site's saved OS state.

- The published application restored My Documents and Projects Explorer windows and a `live-site.url - Internet Explorer` window.
- The IE window displayed Weru's internal “My Links” page at `https://weru.dev/` instead of opening the `.url` destination outside the simulated OS.
- Four rendered external anchors had valid destination URLs but empty `target` and `rel` attributes. This differs from the worktree's `ExternalBrowserLink97`, which uses `target="_blank" rel="noopener noreferrer"`.
- The public DOM therefore proves the deployment is behind current source for the tested link surfaces. It does not prove the current worktree is broken, nor does it prove every deployed route behaves the same way.
- A fresh Chrome-extension visit on 2026-09-25 showed `Portfolio filesystem unavailable: UnknownError: Unknown error` in the accessible page status. The shell nevertheless restored My Documents and Projects windows and an IE window displaying the internal link directory. This establishes a live storage/filesystem failure signal, but not its cause, whether it is transient, or whether the current worktree reproduces it. No browser storage was cleared or modified.

## Project-video source evidence

Local project videos exist at their manifest paths. `ffprobe` reported H.264/yuv420p video plus AAC-LC audio for the four project demos: AfyaTrack (Baseline, level 3.1), Gigaclaw (High, level 4.0), MoniePal (Main, level 4.0), and Adventures (Main, level 4.0). Existing VFS and Media Player SSR tests also verify the project-specific source reaches a video element.

This rules out a missing local file and confirms common MP4 streams; it does not prove Chrome playback from the current worktree. The user's “Media unavailable” capture remains unresolved until the current bundle is tested in a browser.

## Remaining action and boundary

- Browser-test the current worktree's `.url`, IE link, README link, and project-video paths after a current bundle is made available.
- Diagnose the public filesystem `UnknownError` against a current bundle and verify a clean, non-destructive recovery path. Do not clear persisted browser data to test recovery.
- Verify the production README assets and external handoff after an authorized release.
- Do not deploy or modify persisted user browser data as part of this audit.
