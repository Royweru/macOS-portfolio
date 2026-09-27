# Boot Full-Viewport Guard — 2026-09-26

## Finding

The active boot stylesheet already uses a fixed, full-browser overlay. Its source-contract test checked `100vw` / `100vh`, but did not protect the fixed positioning or zero inset. That left the reported centered-canvas regression insufficiently guarded.

## Change

- Extended the raw-Stitch boot contract to require `position: fixed`, `inset: 0`, `z-index: 2000`, and `overflow: hidden` on `.boot97`.
- Retained the `100vw`, `100vh`/`100dvh`, and full minimum-size checks, and explicitly reject 1024px/768px fixed dimensions.
- No runtime boot styling changed; this prevents a future return to the unwanted centered 1024×768 composition.

## Verification and remaining work

- Focused boot source-contract and stage tests pass.
- This regression guard is not a matched-viewport visual comparison. Live BIOS/logo-stage captures, preload/reduced-motion behavior, and full boot interaction remain open in the Chapter 2 tracker.
