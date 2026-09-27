# Chapter 2 — Boot Full-Viewport Guard — 2026-09-26

- Tightened the boot source contract so the overlay must be fixed to all viewport edges, clipped, above the shell, and sized by viewport units—not a centered 1024×768 canvas.
- No runtime styling changed; the focused boot tests protect the full-width behavior the user requested.
- Matched-stage screenshots, live preload/reduced-motion verification, and overall boot parity remain open.
