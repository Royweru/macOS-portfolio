# Weru 97 — Stitch Boot-to-Desktop Transition (2026-09-24)

## Source contract

The retained boot reference's transition reveals the desktop at the end of the splash, slides its taskbar upward after 300ms, pops desktop icons from 600ms at 90ms intervals, and shows the first-visit welcome dialog after 1600ms. The source's embedded legacy desktop styling is not copied; the transition is applied to Weru 97's full-width shell, current shortcut layout, and application windows.

## Implementation

- Added `boot-transition97.ts` as the timing contract shared by the shell, desktop icons, and first-visit wizard.
- Animated the taskbar from below the viewport with a 400ms ease matching the source transition.
- Staggered the live desktop shortcut order, including Weru's additional Outlook Express/Games shortcuts.
- Delayed the first-visit welcome wizard until the source's 1600ms point; user/browser reduced-motion preferences skip the extra wait/entrance motion.
- Kept the boot overlay, full-width background, taskbar sizing, and Weru branding unchanged.

## Verification and remaining work

- Unit tests cover exact timing constants, final icon delay, reduced-motion behavior, and Shell integration/animation opt-in.
- `npx tsc --noEmit`, `npm run lint`, the full suite (30 files / 126 tests), and `npm run build` all passed. The build emitted only the existing stale Browserslist-data notice.
- Live timing and matched-stage visual comparison remain pending; localhost stays stopped until explicitly restarted by the user.
