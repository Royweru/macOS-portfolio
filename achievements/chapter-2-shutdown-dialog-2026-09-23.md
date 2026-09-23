# Chapter 2 — Shutdown Dialog Stitch Extraction (2026-09-23)

## Implemented

- Extracted the Shutdown dialog interior from `Stitch Designs/html/windows_97_system_dialogs_properties.html`; the embedded desktop and duplicate window chrome are not used in production.
- Recreated the 40×40 pixel power-computer icon as crisp-edge SVG and kept the three source choices, including the underlined `S` and `R` accelerators.
- Added controlled radio selection, a working Help explanation, Cancel-to-close behavior, restart handling, and a simulated safe-power-off state. The unsupported second-user option explains the single-session behavior rather than implying a sign-in system exists.
- Set both active shutdown window size definitions to 320×240.

## Live verification

- Reused the already-open Chrome extension tab at `http://localhost:3000/`; no browser tab was created and no native computer UI was used.
- Refreshed the page so it loaded the current source, skipped the boot animation, opened Start → Shut Down, and visually confirmed the dialog and radio choices.
- Clicked Help and confirmed its explanation appeared; clicked Cancel and confirmed the Shutdown window disappeared from the accessibility tree.
- Did not click Yes: Restart reloads the local portfolio and Shutdown enters the power-off view, so those state-changing outcomes remain untested here.

## Automated evidence

- `src/apps/system/ShutDown97.test.ts`: 1 targeted render-contract test passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm test -- --run`: 22 files / 93 tests passed, including the System Warning route added in the follow-up slice.
- `git diff --check`: passed; Git reported only the repository's existing CRLF normalization notices.
- Production build was not rerun in this slice; the localhost dev server was kept available for the requested live browser check.

## Remaining

- Compare source and app at a matched viewport and refine measured padding/spacing if needed.
- Exercise the Yes paths with an explicit reversible browser test setup.
- Compare Recycle Bin's alert against the retained source. The separate System Warning was subsequently implemented and is recorded in `chapter-2-system-warning-2026-09-23.md`.
- Keep the overall System Dialogs manifest status partial until those requirements are verified.

Tracker: `plans/weru97-chapter-2-task-list.md`.
