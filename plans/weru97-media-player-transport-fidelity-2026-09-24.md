# Media Player Transport Control Fidelity

## Source comparison

- Reference: `Stitch Designs/html/windows_97_media_player_6.4.html`.
- Stitch authors each transport button with `w-6 h-6`, which resolves to 24×24px under the preserved design-token scale.
- The shared `Button95` baseline imposes a 72px minimum width, so using it without a local override makes the media transport row materially wider than Stitch.

## Implementation

- Keep the shared classic bevel and button semantics, but scope a 24×24px size override to direct `.win95-button` children of `.win97-media-transport-buttons`.
- Center the glyphs and remove shared padding so the visual hit area matches the source's square controls.
- Add a source-contract regression that checks both the raw Stitch button class and the scoped CSS dimensions.

## Verification and remaining work

- Focused `MediaPlayer97` source/render tests: 3 tests pass. The full project gates pass: TypeScript, lint, 59 test files / 229 tests, production build, and `git diff --check` (with the existing stale Browserslist-data warning).
- Matched-viewport browser comparison and project video playback are not covered by this change; the Media Player screen and functionality remain partial in the Stitch manifest.
- No localhost server or browser UI was started.
