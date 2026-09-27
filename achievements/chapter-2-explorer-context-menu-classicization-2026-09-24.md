# Chapter 2 — Explorer Context Menu Classicization (2026-09-24)

Removed the last clearly modern utility-styled surfaces found in the active Explorer path. File and blank-folder context menus now use a dedicated Win97 component; error, empty, create/rename, and delete-confirmation surfaces use scoped classic CSS. Generic Lucide menu glyphs were removed. File actions, new-item actions, clipboard behavior, and confirmation callbacks are preserved.

Automated SSR regressions cover the file/folder menu variants and disabled Paste. TypeScript and lint passed; the full suite passed (39 files / 150 tests); the production build exited 0 with the existing stale Browserslist notice. This does not replace the still-open live, matched-viewport Explorer comparison.

See `plans/weru97-explorer-context-menu-classicization-2026-09-24.md`.
