# Chapter 2 — Outlook/Games Position Migration (2026-09-25)

- Bumped persisted OS state to version 21 so profiles that already saved version 20 can still repair the one known generated Outlook collision coordinate.
- Kept the migration narrow and tested that customized Outlook and other shortcut positions are preserved.
- Added pairwise desktop icon-cell checks across 596px, 722px, and 912px work areas, including the reported Games → Recycle Bin → Outlook Express rows at 596px.
- The existing live before/after measurement remains the runtime evidence; this follow-up did not have a Weru page open and did not start localhost.

Verification: focused regressions passed (3 files / 48 tests); the full suite passed (62 files / 240 tests); TypeScript and lint passed; `npm run build -- --webpack` passed. Default Turbopack build hit OS error 112 while writing a `.next` source map because the drive is nearly full. No generated output was deleted. Both build modes report stale Browserslist metadata. `git diff --check` passed.
