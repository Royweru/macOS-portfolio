# Chapter 2 — Media Playback Controls (2026-09-23)

## Completed in this slice

- Replaced decorative playlist-only state with a shared playable-media queue helper. It filters unsupported/image assets, deduplicates source URLs, prioritizes a directly opened asset, and formats stable selection keys, filenames, and durations.
- Wired Media Player 6.4 to real audio/video elements and connected selection, Add/Remove, previous/next, eject, playback, seeking, volume/mute, playlist visibility, compact transport, and metadata/error/end reporting.
- Wired CD Player to a real audio-only queue with track selectors, transport, seeking, volume, repeat/shuffle/intro state, and metadata-driven time modes.
- Added a same-origin Web Audio effects graph for CD balance, preamp, bass/treble shelving EQ, EQ bypass, five presets, and reset. External media is deliberately left on native playback so lack of cross-origin audio permission cannot silently mute it.
- Kept Stitch sample tracks as disabled preview rows when no actual assets exist. The browser-visible Add dialog explains that the media library is empty.
- Prevented opened images and unsupported files from becoming a false active/Ready Media Player track.
- Updated the Stitch manifest to keep both media applications functionality-partial until actual playback has been verified.

## Evidence

- Existing Chrome extension tab only, at `http://localhost:3000/`; no native application or extra browser tab was used.
- Live accessibility state showed the three Stitch sample rows disabled, seek and transport disabled, volume/mute still available, and status `No media loaded`. The Add dialog showed the empty-manifest guidance. CD Player's no-disc state and disabled transport were also observed in the same existing tab earlier in this QA pass.
- `PROJECT_MEDIA_MANIFEST` currently contains no assets, so no claim is made that audio or video playback works end-to-end. The EQ graph is verified with node/parameter tests; actual sound with those effects remains unverified until a real same-origin track is supplied.
- Browser extension verified opening the equalizer preset menu, applying Rock (preamp 1dB, bass 5dB, treble 3dB), then Reset (all three 0dB).
- Full current verification: TypeScript and ESLint pass; Vitest 20 files / 91 tests pass; production build passes; `git diff --check` passes. Build emitted only the existing stale Browserslist data notice.
- Task-list visual parity items were downgraded to partial until matched-viewport captures against the Stitch sources are completed; an ordinary browser render is not proof of pixel parity.

## Remaining

- Supply real bundled audio/video, then exercise actual playback, track changes, seeking, volume, end/error states, and reduced motion in the browser.
- Supply a same-origin audio track and verify that balance/EQ audibly affect playback, then verify native playback fallback with an external track.
- Matched-viewport Stitch screenshot comparisons and the broader Chapter 2 task list remain open.

Plan: `plans/weru97-media-playback-controls-2026-09-23.md`.
