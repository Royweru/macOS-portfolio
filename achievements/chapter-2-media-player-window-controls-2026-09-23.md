# Chapter 2 — Media Player Window Controls (2026-09-23)

## Live verification

- Used only the existing Chrome extension tab at `http://localhost:3000/`.
- Closed Media Player with its title-bar X and confirmed its window and taskbar entry disappeared. Reopened it through Start → Programs → Weru Media Player 6.4.
- Clicked its taskbar button while CD Player was above it; the Media Player became focused and moved above CD Player (live DOM z-index 271 vs. 262).
- Dragged the title bar; the window moved by the requested pointer delta.
- Resized Media Player on the east, north, and south edges and southeast corner. DOM bounds changed by the corresponding deltas.
- Minimized it, confirmed the taskbar button remained with minimized state, then restored it from that button.
- Maximized it to the full browser work area above the taskbar and restored it to its prior normal rectangle.
- Returned the test window to its initial 640×520 rectangle at approximately (252,61); the test left no changed Media Player geometry behind.

## Scope and remaining work

- This adds evidence for Media Player only. The per-app close/drag/resize/focus/minimize matrix remains partial for the other application windows.
- This verifies shared window behavior, not Media Player visual parity against a matched-viewport Stitch capture. Real playback also remains unavailable until actual media is supplied.
- No application source code changed in this verification-only slice, so tests/build were not rerun here.

Tracker: `plans/weru97-chapter-2-task-list.md`.
