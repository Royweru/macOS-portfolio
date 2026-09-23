# Phase 0 — Control Plane and Stitch Ingestion

## Status

`[~]` Started. Root tracking directories are created. Stitch MCP currently returns `Authentication required`.

## Required Outputs

- Root `plans/` directory with the canonical Weru 97 plan.
- Root `achievements/` directory with phase history.
- Root `Stitch Designs/` directory with immutable raw Stitch artifacts.
- Stitch reference index containing all 12 screen IDs.
- One artifact directory per screen containing `source.html`, `preview.png`, `metadata.json`, `scope.md`, and `implementation-notes.md`.
- Live task-list status and blocker notes.

## Fetch Procedure

1. Retrieve project metadata for Stitch project `2030522406260678629`.
2. Retrieve each screen by its supplied ID.
3. Save hosted HTML/image URLs with `curl -L`, or decode inline base64 payloads.
4. Preserve raw HTML unchanged.
5. Record screen dimensions, source URL, hash, and available assets.
6. Classify the screen scope before implementation.

## Current Blocker

The Stitch MCP connector is reachable but unauthenticated. No Stitch source artifact has been fabricated or replaced with a screenshot approximation.
