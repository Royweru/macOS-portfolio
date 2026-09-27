# Weru 97 Desktop Horizon and Full-Viewport Audit — 2026-09-27

## Finding

The visible black band between the blue sky and green hills is not a black browser gutter. It is part of the supplied Stitch desktop composition: the page background is black, the sky is 65% high, and the bottom-anchored hill region is 48% high. The independent layer heights intentionally leave a black horizon gap where the hill paths have not yet entered the region.

The current shell is a full-width adaptation requested by Roy. A live measurement in the existing Chrome tab at 1280×598 reported both `.shell97` and `.bliss97-wallpaper` at (0,0), width 1280, height 598. No fixed 1024×768 stage or outer black side gutters were present.

## Verification boundary

- Confirmed: raw Stitch source declares `bg-black`, a 65% sky, and a 48% hill layer.
- Confirmed: local CSS makes the shell and wallpaper fill their containing viewport.
- Confirmed: live Chrome geometry fills the measured viewport.
- Still open: matched-viewport side-by-side screenshot review of the complete Stitch desktop, including icon artwork/selection and shell proportions. The manifest visual state remains `partial`.
- Also observed in the same browser session: X / Twitter is displayed in IE4, the profile is Roy Weru, and the IE Mail button opens Outlook Express addressed to `weruroy347@gmail.com`; Outlook Express title-bar close removed the compose window. No email was sent.

## Regression guard

`src/shell/BlissWallpaper97.test.ts` now asserts the raw black backing and layer proportions while also checking that the app viewport, shell, and wallpaper are full-bleed. This prevents a future attempt to remove the Stitch-authored horizon from accidentally restoring the old fixed-canvas gutters.
