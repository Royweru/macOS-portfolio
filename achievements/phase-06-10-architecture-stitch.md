# Phases 6–10 Architecture and Stitch Slice

## Completed in this slice

- Added the dedicated Win97 window manager, pointer drag/resize hooks, and window chrome path.
- Added the boot state machine with skip and resource preload behavior.
- Added first-visit wizard, screensaver, BSOD recovery surface, synthesized sound engine, visitor API/hook, and scrollbar primitive.
- Added the Stitch screen manifest and preserved the raw HTML references unchanged.
- Added final app-directory entry points for calculator, games, IE4, media player, and CD player.
- Added functional calculator memory/operator state, media transport controls, CD equalizer animation, IE4 visitor counter, and DOS `crash` routing.
- Added Stitch-derived Win97 visual overrides and responsive/reduced-motion rules.
- Added title-bar context actions, Recycle Bin permanent-delete confirmation, Notepad Find surface, shutdown/restart selection, and IE4 links/counter presentation.
- Removed the Stitch runtime font CDN dependency; production typography now uses local/system-safe Win97 fallbacks. Portfolio URLs remain intentional external navigation targets.
- Wired synthesized startup, window-open, window-close, Start-menu, and Recycle Bin sounds into the shell lifecycle.
- Routed `App.tsx` through the documented `BootSequence97 → Shell97 → WindowManager97 → app content` composition.

## Verification

- TypeScript check passed.
- ESLint passed.
- Vitest suite passed.
- Production build passed and emitted `/api/visitors` as a dynamic route.
- Runtime smoke check passed: `/` returned HTTP 200; visitor `GET` returned `count: 0`; visitor `POST` returned an incremented visitor number with the documented local fallback.

## Remaining follow-up

- Replace remaining legacy content adapters with native Win97 app implementations.
- Complete filesystem context-menu behavior, full dialog parity, media asset coverage, and browser/manual visual verification.
- Remove unused legacy imports/files only after the final production build confirms they are unused.
