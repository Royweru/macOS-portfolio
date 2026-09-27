# Weru 97 — Shutdown Action Verification (2026-09-24)

## Scope

Close the automated-verification gap for the retained Stitch Shutdown dialog's three Yes actions without launching localhost or triggering a live browser reload.

## Implementation

- Move action-effect routing into `src/apps/system/shutdown-actions97.ts`.
- Keep the React dialog responsible for its selected radio value and visual result state.
- Route `shutdown` to the safe-power-off state, `restart` to a page reload, and `logon` to the portfolio's unsupported-user notice.
- Play the shutdown sound for each confirmed action.
- Keep restart and power-off as simulated portfolio behavior; they do not operate the host computer.

## Verification

- Unit tests assert the effect calls and state outcome for all three actions.
- Run TypeScript, lint, the full Vitest suite, production build, and `git diff --check`.
- Keep live Yes-button and matched-viewport Stitch comparison open until performed in the browser; this pass does not start localhost.
