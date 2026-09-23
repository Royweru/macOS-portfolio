# Achievement — Explorer Window-Control Sample

Date: 2026-09-23

## Live checks at localhost:3001

- Explorer title-bar X closed the active window; its taskbar entry disappeared. Reopening from the desktop worked.
- East-edge resizing widened the active Explorer window.
- Minimize hid the window while retaining its taskbar button; selecting the taskbar button restored it.
- Maximize filled the browser work area above the taskbar; the same control restored the saved window rectangle.
- The first attempted vertical movement started at the top of the 20px title bar, where the 10px north-edge resize strip overlapped it. That gesture moved the top edge and reduced the window height; it was not a title-bar drag.
- After reducing the north/south resize strips from 10px to 6px and starting in the clear title-bar center, a horizontal drag moved X by about 100px, and a diagonal drag moved X and Y by about 100px and 30px respectively.
- The north-edge resize still worked from its narrowed border target, and the earlier east-edge test widened the window. This confirms the fix separates moving the window from resizing it.
- Validation after the desktop/window-control corrections: TypeScript passed; full lint passed; 14 test files / 34 tests passed; production build exited 0. Build output contains the existing stale Browserslist data notice.

## Status

This is one Explorer sample, not the all-window matrix. The shared interaction is verified on Explorer, while the Chapter 2 all-app control matrix remains partial. Title-bar context-menu and touch checks remain unverified here.
