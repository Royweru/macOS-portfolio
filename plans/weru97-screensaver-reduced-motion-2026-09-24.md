# Weru 97 — Screensaver Motion and Lifecycle (2026-09-24)

## Findings

- The screensaver always advanced its canvas animation, even when the OS reduced-motion setting or browser `prefers-reduced-motion` requested less motion.
- The app supplied an inline `onExit` callback. Any parent render while the saver was active changed that callback identity and restarted the canvas effect and starfield.

## Change

- Read reduced motion through the shared `useReducedMotion97` hook, combining the Weru setting and browser preference.
- Render a static starfield and do not schedule animation frames when reduced motion is active.
- Stabilize the app-level exit callback so unrelated parent renders do not reset the screensaver effect.
- Keep pointer, mouse, and keyboard exit behavior.

## Verification limits

- TypeScript, lint, full tests, production build, and diff check are required for this code slice.
- Reduced-motion appearance, Escape exit, and exit-without-closing-the-underlying-window still need a live browser check. This change does not start localhost.
