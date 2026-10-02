# Chapter 2 — IE4 Visitor Session Counter

Changed IE4's visitor odometer so opening another IE window or reloading the same browser tab does not inflate the visit count. The first tab-session load increments once; concurrent IE windows share that request, and subsequent same-tab loads fetch the latest count without incrementing. If a POST fails ambiguously, it is not blindly retried.

Live browser evidence showed the initial local visit at `0000001`, both simultaneous IE windows at `0000001` with no second request, and a same-tab reload retaining `0000001` via GET. The temporary IE window was closed, the original was preserved, and localhost was stopped.

See [the implementation and verification plan](../plans/weru97-ie4-visitor-session-count-2026-09-28.md).
