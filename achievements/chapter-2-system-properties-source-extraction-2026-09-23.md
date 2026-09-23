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
