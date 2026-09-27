# CD Player and Graphic Equalizer sibling windows

Audited Stitch screen `47dfc46a772046c183e86027164941c5` and corrected an architectural mismatch: the reference contains two independent sibling windows, not one oversized CD Player with an embedded equalizer.

Implemented the Graphic Equalizer as a registered Weru window with its own window-manager lifecycle. Both surfaces now open at source-width defaults as a centered wide-screen pair, or wrap below the 1024px source breakpoint. The shared audio store keeps spectrum/playback and EQ settings synchronized. The CD Player's maximize control is disabled as in Stitch; the Equalizer omits that control. Closing the player also closes its companion and pauses/releases active media resources. The equalizer meter now uses the source's seven segmented color bands.

Verification: raw-source, geometry, close-policy, capability, and titlebar regressions pass. Full TypeScript, lint, 56 test files / 216 tests, and production build pass. Build retains the stale Browserslist-data warning. No server or browser was started for this slice.

Still partial: matched-viewport Stitch comparison, actual audio playback/audible EQ, and the per-app live mouse/touch matrix.

Plan: `plans/weru97-cd-player-sibling-windows-2026-09-24.md`.
