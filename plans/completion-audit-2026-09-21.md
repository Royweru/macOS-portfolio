# Weru 97 Completion Audit — 2026-09-21

## Finding

The project is not complete outside Stitch work. The current source tree is buildable and contains meaningful Phase 6–10 foundations, but several task-list entries are adapters, placeholders, or partial behavior rather than verified final implementations.

## Follow-up implementation

The dedicated window manager, boot sequence, visitor route, screensaver, sound engine, BSOD surface, final app entry-point paths, and local Stitch screen manifest were implemented after this audit. The remaining work below is still valid where it calls for full native app parity, event-level integration, and manual visual verification.

## Phase assessment

| Phase | Assessment | Evidence / remaining work |
|---|---|---|
| 0 Foundation | Partial | Manifest and Win95 styles exist. Raw Stitch artifacts, real Bliss asset, legacy deletion, and dependency cleanup remain. |
| 1 Kernel | Partial | Layout v6, seed, registry, and routing exist. Legacy compatibility code and old data imports remain. |
| 2 UI kit | Partial | The primitive components exist, but several APIs and behaviors differ from the task contract; pixel-art assets and isolation verification remain. |
| 3 Shell | Partial | Desktop97, StartMenu97, Taskbar97, and shell CSS exist, but App still imports legacy Spotlight, Sidebar, ViewControls, and parallax paths. |
| 4 Window manager | Partial | Drag/resize/maximize work through the current adapter. Dedicated `src/wm` hooks/container and title-bar context menu are not present; snap compatibility remains. |
| 5 Boot | Partial | BIOS/start/logo/welcome visuals exist in `components/BootScreen.tsx`; the specified `src/boot/BootSequence97.tsx` state machine, preload path, skip action, and first-visit localStorage wizard are not complete. |
| 6 Core apps | Partial | Nested app entry points exist, but Explorer97/Notepad97/RecycleBin97/MS-DOS are thin wrappers around legacy content surfaces rather than full Win97 implementations. |
| 7 Media | Partial | Entry points and MIME mappings exist. Bundled media, custom transport, CD equalizer, and full Paint behavior remain. |
| 8 Utilities | Partial | Calculator and utility entry points exist. Full Run/Find/Shutdown behavior, IE4 modes, and tabbed system/control-panel behavior require completion and interaction verification. |
| 9 Delight | Partial | Minesweeper foundation and terminal Easter eggs exist. Screensaver, sound engine, BSOD recovery, and remaining Easter eggs are absent or incomplete. |
| 10 Production | Partial | TypeScript, lint, tests, and build pass. Visitor API, responsive/mobile strategy, full accessibility/performance audit, and final cleanup remain. |

## Stitch status

Stitch screen HTML/images have not been fetched. The connector previously returned `Authentication required`; the current task tracking says Stitch refinement is deferred pending manually supplied reference code. No Stitch artifacts were fabricated.

## Verification run

- `npx tsc --noEmit` — passed.
- `npm run lint` — passed after fixing the `handleOpenApp` dependency in `src/App.tsx`.
- `npm test -- --run` — passed: 5 files, 10 tests.
- `npm run build` — passed.
