# Chapter 2 — Boot Splash Layout Contract (2026-09-25)

- Compared the active splash DOM/CSS with its preserved Stitch source and restored the omitted column layout, logo z-layer, explicit flag wrapper, progress-frame alignment, and segment-color transition.
- Added source-bound regressions so splash composition rules are checked against the raw source instead of relying on visual guesswork.
- Kept the boot screen marked partial: matched-viewport screenshots, preload/reduced-motion behavior, and full runtime interaction still need live evidence.

Verification: focused boot tests passed (2 files / 9 tests); full suite passed (62 files / 239 tests); TypeScript, lint, production build, and `git diff --check` passed. Build emitted the existing stale Browserslist-data warning. No local server or browser tab was started.
