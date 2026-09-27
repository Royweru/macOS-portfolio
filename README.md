# Weru 97 Portfolio OS

Weru 97 is a full-viewport portfolio presented as a retro desktop operating system. The active shell, windows, and applications are React components; the preserved Stitch HTML is reference material and is not rendered directly in production.

## Stack

- Next.js App Router, React, and TypeScript
- Zustand for OS/window state
- Dexie for the virtual filesystem
- Scoped CSS and local Win97 assets

## Run and verify

```bash
npm install
npm run dev
```

```bash
npx tsc --noEmit --incremental false
npm run lint
npm test -- --run
npm run build
```

## Active architecture

- `src/app/`: Next.js route, root layout, and global stylesheet entry.
- `src/App.tsx`: boot lifecycle, app routing, filesystem targets, and shell composition.
- `src/shell/`: full-width desktop, Bliss wallpaper, Start menu, taskbar, shortcuts, and context menus.
- `src/wm/`: shared draggable/resizable window frame and window manager.
- `src/apps/`: Explorer, Notepad, IE4, media players, Paint, Calculator, Minesweeper, dialogs, and system tools.
- `src/features/filesystem/`: virtual paths, IndexedDB/Dexie service, seeding, and migrations.
- `src/features/os/`: window state, title/route policy, and safe target resolution.
- `src/data/`: project, document, personal-media, and Stitch-screen manifests.
- `public/assets/win97/`: local cursors, icons, wallpaper, and app artwork.
- `Stitch Designs/html/`: unchanged source references for screen-by-screen extraction and comparison.
- `plans/` and `achievements/`: active implementation tracking and dated evidence.

## Navigation behavior

Internal folders and linked Markdown documents stay inside Weru 97. Allowed HTTP(S) destinations—project links, links in rendered Markdown, Internet Explorer favorites/addresses, and `.url` files—open in a separate tab in the visitor's current browser. If scripted tab opening is blocked, Weru 97 shows a direct retry link. A website cannot force the operating system to launch a different installed browser.

## Window behavior

All application windows use the shared `Window97` frame and OS store for focus, z-order, drag, resize, minimize, maximize, restore, and close policy. App content is routed centrally from `src/App.tsx`; application-specific chrome and interactions live under `src/apps/`.

## Current work status

The authoritative parity and verification ledger is `plans/weru97-chapter-2-task-list.md`. A checked item has evidence; `[~]` marks work that still needs runtime or visual verification. Stitch screenshot parity, the full per-app pointer/touch matrix, and deployment parity must not be inferred from unit tests alone.
