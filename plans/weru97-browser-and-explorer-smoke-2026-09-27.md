# Weru 97 Browser and Explorer Smoke — 2026-09-27

## Scope

Use one temporary Chrome-extension QA tab against `http://localhost:3001/` at a 1422×681 content viewport. The app was started only for this local verification and must be stopped afterward. X, WhatsApp, and Stitch tabs were not opened or changed. No email was sent, no project data was edited, and no deployment was performed.

## Verified in the browser

- Skipping the boot screen revealed the current shell. The desktop and taskbar span the full viewport; there are no black side gutters. The black horizontal band between sky and hills is the intentional Stitch wallpaper composition, not letterboxing.
- Notepad's title-bar X removed the `skills-used.txt` window. Opening `README.md` from the Adventures Explorer rendered its Markdown headings, prose, project details, and live/source links; closing it removed the window. The original `skills-used.txt` view was reopened without changing its contents.
- Adventures Explorer moved from approximately `(90,27)` to `(298,83)` by title-bar drag. A southeast-corner resize changed the frame from approximately `620×430` to `736×516`. Maximize filled the desktop above the taskbar; the next maximize-button click restored the saved rectangle.
- Selecting the Outlook Express desktop shortcut and pressing Enter opened the compose window. The To field was prefilled with `weruroy347@gmail.com`; the window appeared to the right of the desktop shortcut columns. The X closed the unsent draft. In the live view, Outlook Express and Recycle Bin were in column two, while Games remained in column one; no icon/icon collision was visible.

## Not verified / observed risk

- The README live-site anchor advertises “Opens outside Weru 97 in a new browser tab” and is rendered as an active link. Clicking it through the extension's accessibility action and visible-screen click did not add a destination tab to the extension's tab inventory. This could be a browser-harness popup restriction, but the user-visible handoff is not proven; keep external README navigation partial until a destination tab is observed in a normal browser click or a reliable blocked-popup fallback is verified.
- At the initial restored-window position, the Adventures Explorer at `(90,27)` covered the second desktop shortcut column. Moving it right exposed Recycle Bin and Outlook Express. This was a persisted window placement, not an icon collision. Consider a narrow placement-repair policy only if the accepted design requires all desktop shortcuts to remain visible behind restored windows; do not alter the Stitch reference geometry without comparing the source.
- A full Stitch matched-viewport comparison, every-app control matrix, responsive/touch checks, and reload-persistence verification were not performed in this smoke pass.

## Current status

This is evidence for individual browser interactions, not phase completion. Phase 3, Phase 5, and Phase 12 remain partial. Automated test/build results recorded in the task list were run before this browser-only smoke; no application source code changed during this pass.
