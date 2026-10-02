# Run and Find live workflow smoke — 2026-09-29

## Scope

Check Run and Find through Start in the existing Chrome extension tab at `http://localhost:3001/`. The search was read-only; no external destination or email flow was opened.

## Results

- Start → Run opened the Run dialog with its command field, OK, Cancel, and title-bar controls. Clicking the title-bar X removed the dialog and taskbar entry.
- Start → Find opened Find: All Files.
- Searching for `README.md` returned four filesystem matches. Selecting the 845-byte Adventures README enabled Open; clicking Open brought the already-open rendered README.md window above Find. The browser screenshot visibly showed the rendered README in front of the still-open Find window.
- New Search cleared the query and results and restored the initial prompt; the Open button became disabled.
- Find's in-dialog Close button removed the dialog and taskbar entry.
- The temporary test Find/Run dialogs were closed. Existing README, Explorer, IE, and Media Player windows were left untouched.

## Remaining verification

This confirms a focused live workflow, not the full keyboard/context-menu/action matrix or matched-viewport Stitch parity. The independent Run/Find Stitch source is unavailable, so those comparisons remain partial. The local page was restored in the user's existing tab after the earlier server stop. The temporary development server was stopped after QA, and port 3001 was confirmed to have no listener.
