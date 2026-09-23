# Chapter 2 — Project Video Playback and Notepad Readability (2026-09-23)

## Project video defect and fix

The Gigaclaw project manifest requested `/videos/gigaclaw.mp4`, but its actual file is `public/media/videos/gigaclaw.mp4`; the browser therefore could not load the source and Media Player reported “Media unavailable.” All four project demo URLs now point under `/media/videos/` and explicitly declare `video/mp4`.

Project demos are part of filesystem startup synchronization now. Existing seeded IndexedDB media nodes receive the current manifest metadata at startup while preserving their node identity, filename, contents, and creation metadata; no profile data was cleared.

## Notepad readability defect and fix

The `.win97-notepad` wrapper had auto-sized to its children, leaving the textarea only 48px high inside a much taller window. The wrapper now fills the window content and the editor fills that wrapper. The default Courier New text size is 14px with 1.45 line height (previously 12px / 1.35).

## Verification

- Browser: existing Chrome extension tab at `http://localhost:3000/`; no extra browser tabs opened.
- Gigaclaw source: `http://localhost:3000/media/videos/gigaclaw.mp4`; metadata loaded, duration `307.05s`, `readyState=4`, no error. After a user-gesture Play click, `paused=false`; current time advanced through 00:33 and the UI displayed `Playing: Gigaclaw job hunting agent`.
- Before Notepad fix: wrapper `86px`, textarea `48px`, font `12px`. After: wrapper `427px`, textarea `389px`, font `14px`, line-height `20.3px`. The live screenshot showed the larger text and full-height editing surface.
- Tests: full suite passed, 22 files / 95 tests. `npx tsc --noEmit` passed.
- Lint: one unrelated `no-useless-escape` remains at `src/data/stitch-screen-manifest.ts:29:1155`.
- Not run: production build; kept the existing development runtime available for browser verification.

Media end-state, reduced-motion playback, real CD audio, and matched-viewport Stitch comparisons remain unverified.
