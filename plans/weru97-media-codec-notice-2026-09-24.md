# Weru 97 — Media Player Codec Notice Preference (2026-09-24)

## Scope

The Stitch-derived Media Player includes a “Don't show this again” option. It was previously decorative: it was uncontrolled and did not persist a choice.

## Implementation

- Persist opt-out in browser local storage after the user checks the option and dismisses the notice.
- Initialize the notice from the saved preference; leave it visible by default for existing visitors without a saved choice.
- Keep Help able to reopen the notice, and reset the checkbox when reopening it manually.
- Handle unavailable or throwing storage without breaking Media Player.

## Verification and limits

- Unit tests cover first display, persisted opt-out, and storage failure behavior.
- TypeScript, lint, full test suite, production build, and diff check are the verification gates.
- No manual browser interaction or matched-size Stitch screenshot was performed; Media Player visual parity and playback acceptance remain partial.
