# Chapter 2 — External Browser Tab Recheck (2026-09-25)

## Verified

- Clicking IE's GitHub Profile anchor in the current local Weru build created a separate Chrome tab at `https://github.com/Royweru`; the original Weru page stayed open and did not render the remote profile inside simulated IE.
- Focused link/navigation regression suite passed: 7 files, 24 tests.
- Updated the Chapter 2 task list with the evidence and the routes that remain only partially verified.

## Not claimed

- Direct `.url`, typed-address, project-detail, rendered README click paths, popup-blocker recovery, and deployed-site parity were not manually verified in this slice.
- A normal web page cannot choose a different installed browser; the visitor's current browser decides whether a new top-level context is a tab or window.
