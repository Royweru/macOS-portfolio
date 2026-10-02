# Chapter 2 — Pixel-icon alias coverage

Closed a small but visible authenticity gap: registered Weru apps and several legacy shell aliases had fallen through to modern Lucide outline icons despite local pixel-art assets being available.

Updated `src/components/AppIcon.tsx` to route the System Warning, Internet Explorer compatibility, profile/document, and Contact identifiers to local pixel assets. Added `src/components/AppIcon.test.ts`, which checks every registered app ID and five compatibility aliases render from `/assets/win97/icons/` rather than the SVG fallback.

Verification: focused icon suite passed (6 tests); full suite passed (77 files / 377 tests); TypeScript passed; repository lint passed across all 232 TypeScript files; production build passed with the existing stale Browserslist/caniuse-lite notice; and `git diff --check` passed with existing LF-to-CRLF notices. The reused Chrome tab reached the 1422×644 desktop and confirmed Games and Outlook Express occupy separate columns; saved application windows make this unsuitable as a clean-profile or matched-Stitch capture. The temporary server was stopped. This does not claim matched-Stitch icon-art parity. Details: `plans/weru97-pixel-icon-alias-coverage-2026-09-29.md`.
