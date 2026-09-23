# Weru 97 — Master Execution Plan

## Objective

Migrate the existing portfolio OS into a functional Weru 97 desktop that mirrors the documented virtual filesystem, source architecture, OS flows, and Stitch reference designs.

## Execution Contract

- Preserve the existing Dexie filesystem, Zustand state, profile isolation, terminal parser, and pointer-based window behavior while migrating them.
- Converge the source tree to `src/os`, `src/shell`, `src/wm`, `src/components/win95`, `src/apps`, `src/boot`, `src/assets`, `src/styles`, and `src/data`.
- Use current project data as the portfolio source of truth.
- Archive raw Stitch HTML/images under `Stitch Designs/` before converting them into React/CSS.
- Update `tasks_list_windows97_upgrade.md` continuously and record verified work under `achievements/`.
- Never delete legacy code or dependencies until imports, tests, and production build confirm they are unused.

## Phase Order

1. Control plane and Stitch ingestion.
2. Foundation tokens, manifest, assets, and migration safety.
3. OS kernel, filesystem, app registry, and routing.
4. Win95 component kit.
5. Boot sequence and shell.
6. Window manager.
7. Explorer, Notepad, Recycle Bin, and MS-DOS Prompt.
8. Media, utility, system, and game applications.
9. Sounds, screensaver, easter eggs, accessibility, responsive behavior, and production cleanup.

## Visual Fidelity Rule

Stitch HTML and previews are the visual references. Each screen is classified after inspection as a full screen, window, dialog, tab, component, or state variant. Only the required scope is converted; inconsistencies are resolved in favor of the documented Weru 97 behavior and shared design tokens.

## Verification Rule

Every phase must pass the relevant unit tests, `npm run lint`, `npm run build`, and manual interaction verification before being marked complete.
