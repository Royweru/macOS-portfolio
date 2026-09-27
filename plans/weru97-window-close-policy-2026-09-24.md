# Weru 97 Shared Window Close and Control Contract

## Scope

Keep title-bar close, title context-menu close, and Ctrl/Cmd+W on one close policy so app-specific `canClose` capability and dirty-document confirmation cannot be bypassed. Do not let Ctrl/Cmd+W or Ctrl/Cmd+M target windows covered by the screensaver. Render common controls consistently for every registered app, while preserving explicit CD Player and Equalizer maximize exceptions.

## Implemented behavior

- Shared close routing honors each window's close capability and the Notepad unsaved-change guard.
- Minimize/maximize menu actions honor per-window capability flags.
- The screensaver shields the underlying focused window from global and per-window close/minimize shortcuts.
- `Window97` renders close/minimize/maximize affordances and all eight resize hit zones for the registered window types; maximized windows omit resize zones.
- CD Player keeps a visible but disabled Maximize button; Graphic Equalizer omits it.
- Title drag and resize surfaces are touch-safe and stop native panning/selection from stealing pointer gestures.

## Verification and limits

- Fresh full test suite: 65 files / 285 tests pass (2026-09-25).
- `npm run lint` passes.
- `tsc --noEmit --incremental false` passes.
- Production build is being rerun; record its result before closing the final verification gate.
- This server-render matrix verifies affordance presence, not actual clicks, drags, touch, z-order, or per-app behavior in a browser. Phase 3 live matrix remains partial.

See `achievements/chapter-2-window-close-policy-2026-09-24.md` and Phase 3 of `weru97-chapter-2-task-list.md`.
