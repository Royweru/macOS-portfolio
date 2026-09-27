# Chapter 2 — Notepad Menu Command Parity (2026-09-25)

## Delivered

- Corrected the File/Edit/Search/Help command ownership; File no longer saves immediately from its menu label and Edit no longer opens Save As.
- Added source-height classic pop-up menus, guarded clipboard actions, Find Next with wraparound, and a Help dialog.
- Preserved Markdown extension/type in Save As suggestions and disabled the command while linked content is still loading or has failed to load.
- Added keyboard menu opening, top-level navigation, enabled-item arrow navigation, Home/End, Escape dismissal, and focus return.
- Added unit/render regressions for command availability, read-only protection, search behavior, and menu labels.
- Verified focused tests (3 files / 11 tests) and TypeScript. Targeted ESLint had no errors; it reports that CSS is outside its configured file set.

## Not claimed

- Real browser menu clicks, clipboard permission behavior, and the complete save/find workflow have not been tested against the current worktree bundle.
- No localhost server was started and no public deployment was changed.
