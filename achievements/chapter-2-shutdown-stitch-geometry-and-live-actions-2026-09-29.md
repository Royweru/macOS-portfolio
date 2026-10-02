# Shutdown Stitch Geometry and Live Actions — 2026-09-29

- Measured the preserved Stitch Shutdown frame at 319.99×195.57px and (56,64) in the existing Chrome tab at 1422×702 CSS px.
- Corrected Weru's first-open geometry to 319.99×196px at the same anchor and retained the 18px title bar. Reworked the interior flow to remove the excessive blank lower area; narrow viewports still clamp safely.
- Live-verified simulated Shutdown → safe-power-off view → Weru boot, Restart → Weru boot, and Log on → single-session notice → Return to desktop. No host-level power command was invoked; the test window was closed and other saved windows were preserved.
- Focused tests passed (2 files / 3 tests); full Vitest passed (79 files / 382 tests); TypeScript, repository lint (236 files), and production build passed. `git diff --check` passed with existing line-ending notices. Both temporary localhost ports were stopped and verified clear.
- The overall System Dialogs screen, Recycle Bin alert parity, and broader phase remain partial.
