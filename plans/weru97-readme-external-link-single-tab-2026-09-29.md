# Weru 97 README External Link — Single-Tab Smoke

## Goal

Verify that a project link rendered inside the current README.md Notepad preview opens outside Weru 97 exactly once, without navigating or closing the original OS tab.

## Browser steps and evidence

- Reused the existing Chrome-extension tab at http://localhost:3001/; the app restored its saved windows. The README initially sat behind the Projects Explorer. Clicking its taskbar button brought it to the foreground; no saved window was closed or reset.
- Captured a three-tab baseline, then deliberately pressed Enter once on the visible “Open the Adventures website” link.
- The after-state contained exactly one new tab, https://travelicious-rose.vercel.app/, titled “Travelicious | Tailor-made African Journeys”; the external page loaded its project content.
- The original tab remained on Weru at http://localhost:3001/. No second activation was issued after the baseline, so the measured delta is exactly one tab.
- The browser extension rejected closing the newly opened destination tab. The tab remained open; no attempt was made to close unrelated tabs or control browser chrome outside the extension.

## Result and limits

The rendered README keyboard route and one-activation/tab cardinality are verified. The overall external-handoff checklist remains partial: pointer activation should be tested in a trustworthy browser session, typed IE address and project-detail links remain open, popup-block recovery has not been induced, and production parity is not claimed. No deployment was performed.
