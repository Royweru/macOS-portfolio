# Calculator and Minesweeper expanded-window layout — 2026-09-29

## Problem

The Phase 3 live-control check confirmed maximize works but revealed poor expanded layouts: Calculator's key grid stretched across the full viewport, while Minesweeper's capped-width board stayed pinned to the left and left the rest of the surface white.

## Change

- Keep each app root full-width with its classic gray surface.
- Place Calculator controls in a centered panel capped at 320px; this preserves the existing 278px normal window layout while preventing extremely wide keys after maximize.
- Place the Minesweeper scoreboard, 9×9 board, and help text in a centered panel capped at 262px. The app surface fills the window, while the board maintains its source-like compact size.
- Add a focused server-rendered/style-contract test for both panel layout rules.

## Verification

- Focused tests: 3 files / 6 tests passed, including the new layout contract and the existing game arithmetic/engine tests.
- Live browser at 1422px viewport: maximized Minesweeper shows the board centered on gray; maximized Calculator shows a centered bounded keypad rather than viewport-wide buttons.
- Calculator interaction smoke: `7 + 5 =` displayed `12` after the layout change.
- Both temporary app windows were closed. No Minesweeper cells were played.

This improves expanded-window behavior but does not establish exact internal Stitch pixel parity, all gameplay outcomes, the all-app control matrix, or touch/keyboard acceptance.
