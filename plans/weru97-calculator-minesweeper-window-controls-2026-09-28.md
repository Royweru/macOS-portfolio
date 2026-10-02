# Calculator and Minesweeper live window-control check — 2026-09-28

## Scope

Continue Phase 3's per-application control matrix using the already-running Weru 97 QA tab at `http://localhost:3001/`. This check covers Calculator and Minesweeper window chrome only; no calculator expression or Minesweeper board cell was entered.

## Observed results

- Calculator: title-bar drag changed its position; east-edge and southeast-corner drags changed its rectangle; minimize removed it from the open-window tree while retaining its taskbar button; clicking the taskbar button restored it; maximize and restore toggled the window; title-bar X removed the window and its taskbar entry.
- Minesweeper: title-bar horizontal drag changed its position; east-edge and southeast-corner drags changed its rectangle; minimize removed it from the open-window tree while retaining its taskbar button; clicking the taskbar button restored it; maximize and restore toggled the window; title-bar X removed the window and its taskbar entry.
- The temporary Minesweeper window was closed after the check. Its game board was left unplayed.

## Defect and limits

Maximizing Minesweeper fills the desktop-sized window but leaves its small board at the upper-left and exposes a mostly empty white surface. Window state works; the maximized app-content layout is not useful and should be assessed against the relevant Stitch app scope.

This does not verify keyboard close, title-bar context menus, every resize direction, touch/pointer behavior, keyboard focus/z-order across several windows, calculator operations, Minesweeper gameplay, or the remaining app matrix. It is not grounds to mark Phase 3 complete. The QA tab was the existing extension tab; no additional browser tabs were opened.
