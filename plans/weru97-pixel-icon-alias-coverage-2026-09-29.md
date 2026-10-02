# Weru 97 pixel-icon alias coverage — 2026-09-29

## Goal

Remove remaining modern outline-icon fallbacks from common legacy window and application identifiers when the repository already has a suitable local pixel-art asset. This is a targeted authenticity pass, not a claim of full desktop or Stitch parity.

## Implementation

- Audited the active `AppIcon` pixel asset map against every registered application ID and the legacy identifiers used by the shell and older app routes.
- Mapped the System Warning titlebar to the existing system-properties pixel icon; mapped Internet Explorer's legacy alias to the local IE icon; mapped profile/document aliases to the local document icon; and mapped the Contact alias to the local mail icon.
- Added a server-render regression test that requires every registered app ID and each audited compatibility alias to render an image from `/assets/win97/icons/`, not a Lucide SVG fallback.
- Did not invent new icon artwork or alter the preserved Stitch source. Existing artwork is reused only where there is a reasonable semantic match.

## Verification

- Focused icon regression: 6 tests passed.
- Full repository test suite: 77 files / 377 tests passed.
- TypeScript: passed with `npx tsc --noEmit --incremental false`.
- Repository lint: passed all 232 TypeScript files.
- Production build: passed; Next printed the existing stale Browserslist/caniuse-lite data notice.
- `git diff --check`: passed with only the repository's existing LF-to-CRLF working-copy notices.
- Browser smoke reused the existing Chrome tab at `localhost:3001`, without opening another tab. The worktree booted through to the full-width desktop at 1422×644. The current profile restored Explorer, README, Media Player, IE, a compact-player overlay, and codec notice, so this was not clean-profile or matched-Stitch evidence. The desktop placed Outlook Express in column two and Games in column one without overlap. The temporary development server was stopped after capture.
- This desktop screenshot does not exercise every aliased titlebar icon; no matched-viewport per-icon or raw-Stitch visual comparison was performed for this code-only mapping change.

## Remaining

- Compare visible titlebar, Start-menu, and taskbar icon sizes/art against the corresponding Stitch screens at matched viewport dimensions.
- Create distinct pixel art where the current nearest-match document/system icons are not faithful enough.
- Continue the remaining Chapter 2 app/window interaction matrix and one-by-one Stitch comparisons; this slice does not close those items.
