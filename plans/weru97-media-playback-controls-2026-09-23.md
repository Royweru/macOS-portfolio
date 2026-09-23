# Weru 97 Media Playback Controls — Implementation Plan

Date: 2026-09-23  
Scope: Chapter 2 Phase 7 media behavior only. This does not claim full Stitch parity or complete the media acceptance tasks.

## Goal

Make Media Player 6.4 and CD Player controls operate on actual project media assets instead of changing decorative playlist labels. When there is no media, preserve the Stitch-shaped presentation but clearly disable sample tracks and playback controls rather than pretending sample files exist.

## Asset contract

- Declare real media in `src/data/project-media-manifest.ts` and keep files under the existing `/media/videos/` or `/media/audio/` public paths.
- Accept only audio/video assets with a supported media MIME type for playback; image assets stay in Paint/image routing.
- Keep the directly opened playable asset selected first, then make other manifest assets available through the Media Player's Open Media dialog.
- Deduplicate playlist sources and use a stable serialized `(id, source)` key so selection cannot point at a different file than the displayed row.
- Do not fabricate `.avi`, WAV, MIDI, or other sample binaries from the Stitch mockup. Stitch sample filenames are disabled preview rows until matching real assets are supplied.

## Media Player 6.4 work

- Bind video and audio tracks to native `<video>`/`<audio>` elements and reflect browser metadata, time, end, and error events in the UI.
- Wire playlist selection/add/remove, previous/next, eject, play/pause/stop, seek, volume/mute, compact controls, and playlist visibility to the active asset.
- Keep the supplied Stitch preview rows visible but disabled when the project has no playable assets. Explain the empty library in the classic Open Media dialog.
- Filter an opened image or unsupported file out of the active playback queue; it must not produce a false Ready state.
- Honor the reduced-motion preference for decorative player animation. This does not suppress real media playback.

## CD Player work

- Build a real audio-only queue from the playable media manifest and selected opened audio file.
- Drive title/track selectors and the playlist from that queue; bind the selected source to `<audio>`.
- Wire track selection, previous/next, fast seek, play/pause/stop/eject, volume, repeat, shuffle, intro skip, duration metadata, and the elapsed/remaining display modes.
- Keep the Stitch track names as disabled no-disc rows when no audio is available.
- For same-origin audio, route the element through a Web Audio chain: preamp gain, low-shelf bass, high-shelf treble, and stereo pan. Apply settings smoothly and disconnect the graph on eject/unmount. Leave external URLs on native playback unless CORS-safe processing is explicitly implemented; never route them into a graph that could silently mute them.
- Use controlled preamp/bass/treble settings, EQ bypass, preset choices, and reset. Graph topology and parameter behavior are unit-tested; live audio-effect behavior still requires an actual bundled track.

## Verification and acceptance

Implemented-code gates for this slice:

- `npx.cmd tsc --noEmit`
- `npm.cmd run lint`
- `npm.cmd test -- --run`
- `npm.cmd run build`
- `git diff --check`
- Unit tests cover playable-type filtering, duplicate-source removal, opened-item priority, image/unsupported-file rejection, previous/next wrap, and safe filename/time formatting.
- `src/apps/cd-player/audio-effects97.test.ts` covers effect-chain routing, stereo pan, preamp dB conversion, low/high shelf updates, EQ bypass, and node cleanup.
- Browser-extension QA at `http://localhost:3000/` confirms the no-media state: preview rows and transport disabled; Add explains that the project media list is empty. CD Player shows `NO DISC` and disabled transport when no audio exists.

Still required before Phase 7 media tasks can be checked complete:

- Add at least one real bundled video and one real bundled audio asset (or actual intended assets from the portfolio).
- Verify play/pause, seek, volume, mute, track switching, end/error handling, and reduced motion with those assets in the browser.
- With real media, verify CD repeat/shuffle plus audible balance/EQ behavior and the external-source native-playback fallback.
- Verify audible balance/EQ behavior with a bundled same-origin track and preserve an external-source native-playback fallback.
- Compare both app windows at the matching Stitch viewport. The browser extension blocks direct `file://` source navigation, so this plan does not claim a matched source screenshot comparison.

## Status

The controls, same-origin CD audio-processing graph, and honest empty states are implemented. Browser QA verified equalizer preset and reset state; unit tests verify graph parameters and cleanup. Actual playback and audible effects remain unverified because `PROJECT_MEDIA_MANIFEST` is empty. The post-follow-up full suite passes 20 files / 91 tests; TypeScript, lint, production build, and `git diff --check` pass. Media Player and CD Player functionality therefore remain `partial` in the Stitch manifest and Chapter 2 task list.
