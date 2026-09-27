# Weru 97 — Media Player Satellite Surfaces (2026-09-24)

## Stitch finding

In `Stitch Designs/html/windows_97_media_player_6.4.html`, the WMP Compact Mode surface and Codec Notice are siblings of the main 640px player window. The compact surface is anchored 48px from the right and 64px from the top; the codec notice is anchored 96px from the right and near the work-area bottom. Their positions are desktop-relative, not relative to the main player's content.

The prior React implementation rendered both surfaces inside `.win97-media-surface`, which is clipped by the window content and therefore cannot reproduce those desktop anchors.

## Implementation

- Registered the shell dialog layer as a small external store consumed with `useSyncExternalStore`, allowing owned React surfaces to portal outside their clipped parent window without an effect-driven state update.
- Portaled the Compact Player and Codec Notice to that layer while retaining their React state ownership and shared media controls.
- Matched the Stitch desktop anchors (Compact: top 64px/right 48px; Codec: right 96px/bottom 10px above the enlarged 46px taskbar), with safe 8px edge anchors and width limits on viewports up to 400px wide.
- Added bounded pointer dragging for Compact Mode and its source minimize/close controls; the View menu can restore it.
- Kept the codec opt-out and Help reopen behavior unchanged.

## Verification and remaining acceptance

- SSR test confirms both satellite surfaces and Compact Player controls are rendered.
- Shell dialog-layer store test confirms host registration and unregistration notifications.
- Full suite: 38 test files / 147 tests passed; `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed. The build retains the existing stale Browserslist database notice.
- No localhost server was started. Live drag behavior, source-to-app matched-viewport imagery, and reduced-motion/media playback remain unverified and the Stitch manifest status stays partial.
