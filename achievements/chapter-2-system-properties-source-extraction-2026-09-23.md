# Chapter 2 — System Properties Source Extraction — 2026-09-23

## Implemented

- Re-read the System Properties General tab in `Stitch Designs/html/windows_97_system_dialogs_properties.html` and extracted its 64px CRT/tower drawing, specification hierarchy, Courier hardware text, groupbox, and segmented meters.
- Replaced the generic computer icon with a React SVG using the Stitch monitor, stand, tower, drive slots, and screen geometry inside an 80px beveled frame.
- Rebuilt the General tab information as System, Registered to, and Computer sections while keeping Weru 97 branding and the portfolio identity.
- Replaced smooth resource bars with the source's 21-cell System Resources and 18-cell User Interface Heap meters (39 cells total), with accessible meter labels and values.
- Kept the General, Device Manager, Hardware Profiles, and Performance tabs as functional React states, with arrow/Home/End keyboard navigation and tab/panel ARIA relationships.

## Files

- `src/apps/system/SystemProperties97.tsx`
- `src/apps/system/SystemProperties97.test.ts`
- `src/apps/system/system-properties-tabs97.ts`
- `src/styles/window97.css`
- `src/data/stitch-screen-manifest.ts`
- `plans/weru97-chapter-2-task-list.md`
- `plans/weru97-chapter-2-parity-audit-2026-09-22.md`

## Verification

- System Properties tests: passed; SSR assertions cover source hierarchy, Weru identity, 39 cells, and meter values; navigation tests cover arrows, Home, and End.
- TypeScript: passed.
- ESLint: passed.
- Vitest: 15 files / 37 tests passed.
- Production build: passed; existing stale Browserslist notice remains.

## Still open

- No live browser screenshot was captured after this source-shaped update.
- Exact pixel comparison at the supplied source viewport is still required.
- System Dialogs screen parity remains partial: the four source dialog regions are not reproduced as simultaneous overlays, and independent source ID `799ddaad07824567a8cd7dc487e75048` is still missing.

## Follow-up — live extraction and source-backed launch (2026-09-23)

- Compared the System Properties window in the retained HTML/Stitch screenshot against the active React surface in the existing localhost tab. The app reproduces the four tabs, CRT/tower art in its beveled frame, specification hierarchy, 21/18-cell green meters, and OK/Cancel actions; Weru branding and portfolio identity remain intentionally adapted.
- Changed the app window to the source's 460×420 geometry and added a viewport-centered placement with the source's slight upward bias. This uses live viewport bounds and still clamps above the enlarged taskbar.
- Fixed the source-backed My Computer > Properties context action, which previously closed the menu without opening anything. It now opens System Properties. The desktop-background Properties action now opens Control Panel; unsupported per-shortcut Properties is visibly disabled rather than a no-op.
- Live browser verification: opening System Properties from Start → Programs and then through My Computer > Properties both exposed the four-tab dialog. The active app viewport was 744×638 CSS px, not the source's 1280×1024; this proves behavior and content presence only, not pixel parity.
- Added geometry and Properties-route regression coverage. Full validation will be recorded after rerunning the suite/build; the matched-viewport comparison and remaining dialog compositions stay open.
