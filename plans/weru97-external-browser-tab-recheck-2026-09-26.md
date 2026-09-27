# Weru 97 External Browser Handoff Recheck — 2026-09-26

## Purpose

Continue the Chapter 2 live audit for external URLs. Remote websites must open outside simulated Internet Explorer while the Weru desktop stays available.

## Current-worktree browser evidence

- Reused the existing Chrome QA tab and started the current worktree temporarily at `http://localhost:3000/`; no second app or Stitch server was started.
- Launched IE from the Weru desktop and clicked its GitHub Profile directory link. Chrome opened `https://github.com/Royweru` in a separate tab; the Weru tab remained at the OS desktop.
- Opened Explorer at `C:\Projects\Adventures` and activated `live-site.url`. Chrome opened `https://travelicious-rose.vercel.app/` in a separate tab; the remote page was not rendered inside simulated IE.
- Focused automated verification: 6 test files, 21 tests passed. Covered safe HTTP(S) handling, `.url` target resolution, detached/no-referrer handoff, native `_blank` links, popup-block fallback, IE, and rendered Markdown links.
- Stopped the temporary local server after the check; ports 3000 and 3001 had no listener afterward.

## Scope limits and test note

- This verifies one IE anchor and one project `.url` file only. Typed-address navigation, project-detail actions, a clicked rendered README link, history behavior, visitor fallback, popup-block recovery, and the deployed website remain unverified.
- Three duplicate Travelicious tabs were briefly reported as open during earlier retries. A later Chrome inventory on 2026-09-26 showed only the user's X and Vercel tabs, so the duplicates were no longer present and no close operation was needed. The current Chapter 2 continuation opened one temporary Weru QA tab; it is not marked to persist and will be cleaned up automatically.
- A website can request a new top-level context in the visitor's current browser, but cannot force a specific installed browser application. Browser settings decide tab versus window and may block scripted opens.
- This is a partial verification record, not a claim that the Chapter 2 external-navigation acceptance item is complete.
