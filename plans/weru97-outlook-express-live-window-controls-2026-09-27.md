# Weru 97 Outlook Express Live Window Controls — 2026-09-27

## Scope

Focused Phase 3 browser-extension check of the Outlook Express compose window. Used the existing Chrome-extension QA tab only; no native UI, mail send, extra tab, or production action was involved. The test ran against the local development app on `localhost:3001`; its origin is isolated from the previously used `127.0.0.1` browser profile.

## Verified

- Double-clicking the Outlook Express desktop shortcut opened the compose window with the expected recipient `weruroy347@gmail.com`.
- At the test viewport, the initial frame began beside the Outlook Express desktop icon; its title bar did not obscure the icon artwork or label.
- Dragging the title bar moved the window right by about 100px.
- Dragging the southeast resize handle widened the window by about 72px; the bottom stayed clamped above the taskbar.
- Clicking the title-bar X removed the compose window and its taskbar entry.
- No email was sent and no message content was entered.

## Still open

This is one live window-control sample, not the all-app acceptance matrix. Other resize edges/corners, pointer/touch/keyboard variants, persisted geometry on the user's existing origin, and full Stitch visual comparison remain partial.
