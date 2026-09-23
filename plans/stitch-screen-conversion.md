# Stitch Screen Conversion Plan

## Source policy

The files under `Stitch Designs/html/` are immutable visual references. They are not production components: their CDN Tailwind configuration, imperative scripts, and duplicate desktop wrappers are intentionally not imported into React.

## Classification policy

- Boot is converted into `BootSequence97` without its embedded desktop.
- Desktop references feed `Desktop97`, `Taskbar97`, `StartMenu97`, and `ContextMenu97`.
- Composite references contribute only the named application windows or dialogs.
- Window interactions are implemented by the real Zustand window store and `WindowManager97`.
- Functional behavior comes from the task list and migration blueprint, not from Stitch mock scripts.

## Current mapping

The authoritative mapping is `src/data/stitch-screen-manifest.ts`. Two system-dialog IDs and one dual-Explorer variant have no separate local HTML artifact; they are marked `derived-missing-source` and implemented from the documented contracts until their source artifacts are supplied.

## Conversion gates

Each screen is accepted only after its React implementation renders at the reference viewport, has no CDN dependency, preserves the required interaction behavior, and passes TypeScript, lint, tests, and production build checks.

