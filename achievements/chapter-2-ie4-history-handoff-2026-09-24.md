# Chapter 2 — IE4 External-Handoff History (2026-09-24)

Typed HTTP(S) destinations and Web Search now enter IE4's Back/Forward history while still opening outside Weru 97 in a separate browser tab. Back returns to the Weru home surface; Forward reopens the external destination. Navigating after Back truncates the old forward branch, and unsafe schemes are rejected before navigation state changes.

The pure history behavior has regression tests. Live interaction remains unverified because localhost is intentionally stopped and the deployed bundle does not yet reflect this worktree. See `plans/weru97-ie4-history-handoff-2026-09-24.md`.

Later refinement: external sites are no longer represented as entries in simulated IE history. They open in the user's browser tab and Weru IE stays on its local home surface; the external tab owns its native history. See `plans/weru97-browser-external-tab-handoff-2026-09-24.md`.
