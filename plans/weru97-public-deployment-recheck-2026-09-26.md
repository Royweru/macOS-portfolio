# Weru 97 Public Deployment Recheck (2026-09-26)

## Scope

Read-only browser-extension recheck of `https://weru97.vercel.app/` to compare visible production state against the current worktree. No local server was started, no user tab was repurposed, and no browser storage was cleared.

## Observations

- Opened exactly one temporary Chrome extension tab. The site first showed its BIOS stage and then reached the desktop.
- The deployed profile restored My Documents, Projects, and README windows. My Documents listed Resume, about_me, experience, and skills; Projects listed Adventures, AfyaTrack, Gigaclaw agent, and MoniePal POS and ERP.
- Production resize-handle DOM measurements: straight edges 6px; corners 10×10px; computed `z-index: 20` and `pointer-events: auto`.
- Current worktree styles are 8px straight-edge targets and 12×12px corner targets. The production bundle therefore does not include the current hit-area improvement.
- Production exposed an Explorer-style `README.txt` window with an accessibility label `README.md contents`; its read-only text still contains `REPLACE_WITH_ADVENTURES_LIVE_URL`.
- After clicking Preview, the observed DOM still contained the read-only textbox and no `.win97-markdown-preview` or rendered external anchor. Therefore the current live README could not be used to validate the new-tab link behavior.

## Result

The public bundle is behind the current worktree for at least the resize hit area and README/Markdown route. This confirms a deployment-parity gap; it does not establish that the local source is broken. No deployment was performed because publishing is a separate external change, and no browser profile or filesystem data was modified.

## Remaining

- After a release is explicitly authorized and available, recheck the README file title/content, Markdown rendering, and an external link opening outside Weru 97.
- Recheck the production filesystem restore without clearing the user's browser storage.
- Keep Stitch visual and app interaction acceptance separate from this deployment check.
