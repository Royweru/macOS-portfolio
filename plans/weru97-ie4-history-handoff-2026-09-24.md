# Weru 97 IE4 History for External Handoffs — 2026-09-24

## Behavior contract

- HTTP(S) addresses entered in IE4 open in a separate browser tab, never embedded in the Weru window.
- A successful typed navigation or Web Search is added to IE4's Back/Forward history.
- Back restores the Weru home page; Forward reopens the external address in another browser tab and displays the handoff surface in IE4.
- A new navigation after Back discards the forward branch, and history cannot step past either end.
- Unsafe schemes remain rejected before changing the address/history.

## Implementation

- Added a small pure history helper with append/branch-truncation and bounded stepping.
- Updated IE4 so typed external addresses and searches update address/history while preserving the popup-safe synchronous `window.open` handoff.
- Updated history replay to make the current IE address match the selected history entry.

## Verification

- Added tests for external entry, Back/Forward bounds, and forward-branch truncation.
- Existing IE4 render/navigation tests remain in place.
- `npx tsc --noEmit`, `npm run lint`, the full suite (42 files / 161 tests), and `npm run build` pass after the current browser/shell updates.
- No localhost runtime was started. The deployed README asset differs from the worktree; live Back/Forward interaction remains partial until the current code is available in a browser session.

## Later behavior refinement

The subsequent browser-handoff refinement in `plans/weru97-browser-external-tab-handoff-2026-09-24.md` supersedes the external-entry history behavior above: remote URLs now open in the user's browser tab while Weru IE remains on its own home page, so those destinations are not added to simulated IE history. Back/Forward remains for pages actually rendered within Weru IE.
