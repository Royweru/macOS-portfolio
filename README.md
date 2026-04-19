# OS Design Portfolio

An interactive portfolio built as a desktop-style experience inspired by macOS.
The UI includes a menu bar, desktop icons, draggable windows, dock behavior, and a Spotlight-like command palette.

## Tech Stack

- React 19 + TypeScript
- Vite
- Framer Motion (animations)
- react-rnd (draggable/resizable windows)
- Tailwind CSS + custom CSS tokens

## Run Locally

```bash
npm install
npm run dev
```

Build and quality checks:

```bash
npm run lint
npm run build
```

## Project Structure

- `src/App.tsx`: root shell orchestration (boot screen, wallpaper, windows, dock, menu bar, spotlight)
- `src/components/`: desktop shell primitives (`MenuBar`, `Window`, `Dock`, `Desktop`, `Spotlight`, etc.)
- `src/windows/`: lazy-loaded content windows (`About`, `Projects`, `Skills`, `Experience`, `Contact`)
- `src/constants/index.ts`: central configuration (window configs, menu definitions, skills/jobs data)
- `src/hooks/useWindowManager.ts`: window state machine (open/close/minimize/focus + section/view state)
- `src/data/projects_data.json`: projects content
- `src/styles/`: shared visual system and shell styling

## Menu Bar Architecture

The menu bar is intentionally data-driven.

- Source of truth: `MENU_BAR_ITEMS` in `src/constants/index.ts`
- Visual grouping: `MENU_BAR_SEPARATORS` in `src/constants/index.ts`
- Render and dispatch: `src/components/MenuBar.tsx`
- Runtime command handlers: `src/App.tsx`

Each menu entry has typed metadata:

- `id`: stable key
- `label`: displayed text
- `enabled`: static enabled/disabled baseline
- `shortcut`: optional shortcut label
- `action`: `{ type, target }`
- `disabledReason`: optional tooltip reason

Supported action types:

- `openWindow`: opens a portfolio window (`about`, `projects`, etc.)
- `externalLink`: opens external URLs in a new tab
- `command`: routed to app-level command handlers
- `none`: disabled/no-op entry

## Maintaining Menu Items

When adding or updating a menu item, follow this order:

1. Add or update the item in `MENU_BAR_ITEMS`.
2. Place separators via `MENU_BAR_SEPARATORS`.
3. If `type: "command"`, implement handling in `handleMenuCommand` in `src/App.tsx`.
4. If `type: "externalLink"`, ensure target URL is correct and safe.
5. Run `npm run lint && npm run build`.

Guidelines:

- Do not leave enabled items as no-ops.
- Keep unsupported system-like actions disabled with `disabledReason`.
- Prefer explicit command IDs (for example: `close-focused`, `minimize-focused`).
- Keep labels concise and consistent with desktop conventions.

## Keyboard Shortcuts

Current app-level shortcuts:

- `Cmd/Ctrl + N`: open Projects window
- `Cmd/Ctrl + W`: close focused window
- `Cmd/Ctrl + M`: minimize focused window
- `Cmd/Ctrl + Space` and `Cmd/Ctrl + K`: open Spotlight

Shortcut behavior is guarded to avoid triggering while typing in inputs/textareas/contenteditable elements.

## Release Checklist

- `npm run lint` passes
- `npm run build` passes
- Enabled menu items are functional
- Disabled items are visually muted and inert
- Spotlight, dock, and window interactions still behave correctly
