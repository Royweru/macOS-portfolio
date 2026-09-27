# Chapter 2 — Public Deployment Parity Audit (2026-09-25)

## Delivered

- Inspected the existing public `weru97.live` app in one Chrome-extension tab without clearing storage or deploying.
- Confirmed that its `.url` app still renders an in-OS IE preview and its four external anchors lack `target="_blank"`/`rel`, unlike the current worktree.
- On a fresh public-page visit, observed the accessible `Portfolio filesystem unavailable: UnknownError: Unknown error` message while the shell restored saved Explorer and IE windows. Recorded this as an unresolved production blocker; the browser profile was not cleared or modified, and the cause was not inferred.
- Used `ffprobe` to confirm all four local project MP4 files have H.264/yuv420p video and AAC-LC audio; this narrows the media failure investigation but does not verify playback.
- Updated the Chapter 2 checklist to distinguish current-source automated evidence from stale published behavior.

## Current-worktree revalidation (2026-09-25)

- Re-ran the full gates after the source-level external-link review: Vitest 66 files / 304 tests, ESLint, `tsc --noEmit --incremental false`, and `next build` all exited successfully.
- These checks validate the current worktree only. They do not update or re-verify `weru97.live`; its stale IE `.url` preview and external-anchor attributes remain the latest published evidence.
- Re-ran the focused external-routing suite after the user's follow-up: 5 files / 21 tests passed. The current source routes HTTP(S) `.url` targets and typed IE addresses to a detached new tab, renders README/project web links as safe `target="_blank"` anchors, and preserves a retry link if scripted popups are blocked.
- No source change was necessary for this request because that separate-page behavior is already implemented in the worktree. A site can request a new tab in the visitor's current browser; web security does not allow it to force-launch a different installed browser application. The published app remains unverified and is not changed by these tests.

## Not claimed

- No current-worktree browser run or project-video playback was performed.
- No deployment or browser-storage cleanup was performed.
- Matched-viewport Stitch parity remains open.
