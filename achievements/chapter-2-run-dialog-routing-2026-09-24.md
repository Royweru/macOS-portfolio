# Chapter 2 — Run Dialog Routing (2026-09-24)

## Delivered

- Mapped `Windows Media Player` to the installed Media Player application alongside the existing classic aliases.
- Routed quoted/relative/full paths and exact filenames through the virtual filesystem and the shared `targetForNode` dispatch, preserving normal extension-based app selection.
- Routed HTTP(S) addresses through the external target path; unsafe schemes and protected `regedit` / `format c:` commands are rejected without invoking host commands.
- Reported missing paths and ambiguous same-name files with actionable messages.
- Invalidated pending async lookups whenever another Run command is submitted or the dialog closes, preventing an old lookup from unexpectedly launching after newer input.
- Updated the Phase 9 tracker, the Run routing plan, and the missing-source System Dialogs manifest note.

## Verification

- Full Vitest suite: 27 files, 116 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed (Next.js emitted only the existing stale Browserslist-data advisory).
- Focused resolver suite: 6 tests passed, including alias, path, web URL, protected command, file routing, and duplicate/missing-file behavior.

## Not claimed

- Run and Find visual parity against Stitch is still open; the independent System Dialogs source artifact is missing.
- The full live dialog interaction matrix remains incomplete. No localhost server or browser session was started for this slice.
