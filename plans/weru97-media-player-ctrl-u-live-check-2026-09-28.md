# Weru 97 Media Player Ctrl+U Live Check — 2026-09-28

## Scope

Verify the File-menu Ctrl+U accelerator in the current local worktree without sending a request to an external URL.

## Result

- Opened Adventures' bundled MP4 in Weru Media Player using the existing Explorer window.
- Dismissed the Codec Notice, opened the File menu, then sent Ctrl+U while focus was within the Media Player.
- The File menu closed and the “Open URL” dialog appeared with the “Media URL” field focused. This is direct live evidence for this accelerator and its intended destination.
- The first follow-up attempt to enter a same-origin bundled MP4 URL timed out in the browser extension. A later same-day follow-up successfully submitted `http://localhost:3001/media/videos/gigaclaw.mp4`, verified playback and pause, and restored the original playlist; see `plans/weru97-media-player-url-submit-and-ie-history-smoke-2026-09-28.md`.
- Stopped the temporary localhost:3001 dev server. The extension failure prevented confirming whether the test player window was closed before disconnect; no external URL was submitted.

## Acceptance still open

- Invalid URL rejection and the broader Open URL error paths.
- Ctrl+O, Ctrl+P, Ctrl+S, and Ctrl+A behavior.
- Matched-viewport full Media Player comparison with Stitch.

The broader menu task remains partial in `plans/weru97-chapter-2-task-list.md`.
