# Chapter 2 Achievement — Desktop Shortcut Source Order

Date: 2026-09-25

## Completed

- Pinned all nine supplied desktop shortcut positions to the raw Stitch order.
- Explicitly normalized Stitch's `pictures` and `ie` source IDs to Weru's `my-pictures` and `internet` shortcut IDs without changing the order.
- Verified Outlook Express follows the supplied icons and does not overlap the adjacent shortcut at the 722px work-area test size.
- Kept the requested 40px artwork and 80px row pitch.

## Verification

- Source-backed shortcut and responsive-layout tests pass (2 files / 8 tests), including pairwise non-overlap at 596px, 722px, and 912px work-area heights.
- Matched-size browser screenshot comparison is still open; this entry does not claim visual parity.

See `plans/weru97-desktop-shortcut-source-order-2026-09-25.md`.
