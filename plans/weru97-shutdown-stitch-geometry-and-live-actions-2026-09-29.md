# Shutdown Stitch Geometry and Live Actions — 2026-09-29

## Goal

Correct the Shutdown dialog's live window to match its retained Stitch composition, then verify each confirmation action in Weru without touching the host operating system.

## Source and diagnosis

- Raw source: `Stitch Designs/html/windows_97_system_dialogs_properties.html`, `data-purpose="dialog-shutdown"`.
- In the existing Chrome extension tab at a 1422×702 CSS-pixel viewport, the source frame measured 319.99×195.57 at (56,64). Its title bar measured 18px.
- Weru previously opened the dialog centered at 320×240, and `space-between` plus an auto-pushed footer left an oversized blank region.
- The source intentionally anchors the dialog at the top-left, across part of the desktop icon rail. The generic shortcut-avoidance offset was therefore inappropriate for this particular source-authored dialog.

## Implementation

- Added `getShutdownInitialRect97()` and `SHUTDOWN_STITCH_RECT97` with a 320×196 source-derived rect at (56,64), clamped against the actual browser work area on smaller viewports.
- Routed newly opened Shutdown windows through that geometry and bypassed only the generic shortcut-rail offset for Shutdown; other applications retain their placement behavior.
- Changed the configured height from 240px to 196px. Tightened the dialog's row/footer flow, paragraph spacing, radio-label alignment, and footer border spacing to follow the source's natural-height content rather than distributing it across a tall box.
- Kept the standard 18px title bar, Weru 97 product name, full-width shell, and existing user window positions.
- Added geometry tests for the wide source viewport and a narrow/short viewport, and updated the Shutdown component geometry assertion.

## Verification

- Focused Vitest: `src/apps/system/ShutDown97.test.ts` and `src/apps/system/shutdown-window-geometry97.test.ts` — 2 files, 3 tests passed.
- Full Vitest suite: 79 files / 382 tests passed.
- `npx tsc --noEmit --incremental false` passed; Next production build's TypeScript stage also passed.
- Repository lint passed across all 236 TypeScript files; targeted ESLint on the changed TypeScript files also passed.
- `npm run build` passed (Next 16.3.4). It printed the existing stale `caniuse-lite`/Browserslist data notice only.
- `git diff --check` passed. Git printed the worktree's existing LF-to-CRLF conversion notices.
- Same-tab browser comparison against raw Stitch: source 319.99×195.57 at (56,64); Weru 319.99×196.00 at (56,64), with a measured 18px title bar. Height differs by under 0.5px due to source subpixel rounding. The new window was visually inspected over the existing saved desktop windows.
- Live action checks: Shutdown displayed “It's now safe to turn off your computer”; clicking it re-entered the Weru boot sequence. Restart also re-entered boot. Log on displayed the single-session notice; “Return to desktop” closed only the test window. No action shut down the host, erased data, or sent information externally.
- The temporary Shutdown test window was closed. Other saved windows were left intact. Temporary localhost:3001 and raw-Stitch :3002 servers were stopped; a listener check confirmed both ports clear.

## Remaining scope

The screen manifest remains `partial`: System Properties and System Warning are separate compositions; the Recycle Bin alert's matched-viewport/live dismissal check and complete screen-level visual comparison remain open. This slice does not complete Phase 9 or overall Stitch parity.
