# Weru 97 Chapter 2 — Project Video Asset Audit and Runtime Follow-up

## Purpose

Trace every project demo from `PROJECTS` through its VFS file and Media Player source, then verify real browser playback rather than treating file existence or a rendered `<video>` tag as proof.

## Existing evidence

- All four configured demo files exist, have MP4 container signatures, and seed into their own project folders with `media-player` routing and the corresponding asset URL.
- FFmpeg decoded MoniePal, AfyaTrack, Gigaclaw, and Adventures clips.
- Production asset requests returned HTTP 200 with `video/mp4`; Gigaclaw also returned HTTP 206 for a range request.
- Source regressions verify project media binding, source/title selection, enabled playback controls, and migration from the old generated `demo.avi` label.

## Current-worktree browser check — 2026-09-25

Using the existing Chrome browser tab only, the current production build was served temporarily on `127.0.0.1:3000` and shut down after the check. Navigating `C:\My Computer → C:\Projects → Gigaclaw agent → gigaclaw.mp4` opened Weru Media Player. After dismissing the non-blocking codec notice, the player reported `Playing: Gigaclaw job hunting agent`; the readout advanced from `00:00` to `00:09` of `05:07` (3%), and pressing Pause left it at `00:16` with `Paused` status. This is direct evidence that the current-worktree React player can decode and play the Gigaclaw project video.

The same session verified linked content: `C:\Projects\Adventures\README.md` opened as a rendered Markdown preview with its project links identified as opening outside Weru in a new browser tab; `C:\My Documents\about_me.txt` fetched and displayed its complete linked text asset in read-only Notepad. Explorer X closed the window; its taskbar button reopened it; pointer dragging moved it, and a southeast-corner drag resized it. One east-edge drag attempt produced no visible width change and remains an open handle-specific check. The C: Explorer tree showed Projects, Videos, Pictures, and Music as distinct root-level folders.

## Still outstanding

- Test real playback for the other three project demos, plus seek, volume/mute, end state, and reduced-motion behavior.
- Finish the per-application close/drag/resize/maximize/minimize interaction matrix.
- Verify external-tab behavior in the current worktree without relying only on source tests, and reconcile after an authorized deployment.
- Complete per-screen matched-viewport Stitch comparisons; this runtime smoke test does not prove visual parity.
- Keep the Chapter 2 task list partial until these acceptance items have evidence.

Focused regressions re-run with the browser smoke pass on 2026-09-25: 6 test files / 94 tests passed, covering VFS seeding, URL/media routing, README rendering, media-player behavior, persisted shortcut migration, and window markup. No production deployment or profile reset was performed.
