# Weru 97 — Media Player Stitch Geometry (2026-09-24)

## Source finding

The retained Media Player Stitch HTML defines the active window as `w-[640px]`, and the implementation plan and screen manifest specify a 640×520 logical window. The active `WINDOW_CONFIGS` geometry already matched 640×520; a separate descriptive `APP_REGISTRY.defaultWindow` value was stale at 820×560. While checking this, I found the descriptive registry duplicated divergent dimensions for several other applications too. The UI did not use that stale metadata to size windows, so this was a source-of-truth inconsistency, not a live visual-size fix.

## Change

- Derive every descriptive `APP_REGISTRY.defaultWindow` from the active `WINDOW_CONFIGS` entry instead of maintaining a second set of numeric sizes.
- Keep the desktop and taskbar full browser width; active app geometry remains controlled by `WINDOW_CONFIGS` and is unchanged by this catalog cleanup.
- Type registry IDs as `WindowId` so each registered app must map to an active window config.
- Add a regression test that checks every registered app size against its active configuration, including the Stitch-sized Media Player.

## Verification limits

- Registry test confirms every app metadata size derives from its active window configuration; Media Player remains 640×520.
- This catalog correction does not change runtime window geometry or overwrite saved rectangles.
- Live matched-viewport comparison remains open because localhost was not started.

## Correction — 2026-09-25

The initial source-height conclusion above was wrong: it inferred a 640×520 window from the old implementation rather than measuring the retained Stitch HTML. A Chromium source audit measured the rendered outer window at **640×396** (1280×580 viewport, DPR 1.5). The active default and narrow legacy-rectangle migration have since been corrected; see `plans/weru97-media-player-source-geometry-correction-2026-09-25.md`. The registry derivation change described above remains valid, but the old 640×520 source claim and its “remains 640×520” verification are superseded. Internal matched-viewport comparison is still outstanding.
