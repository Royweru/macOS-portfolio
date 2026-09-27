# Chapter 2 — Production README Divergence Audit (2026-09-24)

Compared the existing deployed Weru browser session with the current worktree while auditing the new-tab external-link flow.

- Found that the live session still exposes an Adventures `README.txt` view containing `REPLACE_WITH_ADVENTURES_LIVE_URL`.
- Revisited `https://weru97.vercel.app/` in the already-open blank browser tab without starting localhost; the live accessibility tree again showed the stale placeholder and `.txt` title over Markdown content.
- Directly fetched the deployed Markdown URL (HTTP 200) and confirmed the response body itself still contains the placeholder, narrowing the mismatch to a stale published asset rather than only cached VFS text.
- Confirmed the current worktree uses the linked `/text/traveling_agency_readme.md` asset and the real configured URL; focused filesystem/Markdown tests pass (15 tests).
- Recorded the production asset as stale; whether the deployed application bundle/profile also lags remains untested.
- Preserved the existing browser/profile. No deployment, data clearing, or external-link navigation was performed.

This is a completed diagnostic record, not a claim that production has been fixed. The related Chapter 2 acceptance task remains partial in `plans/weru97-chapter-2-task-list.md`.
