# Weru 97 — Run Dialog Routing (2026-09-24)

## Goal

Make Run actually resolve the programs, folders, documents, and web resources its prompt advertises, while keeping file opening inside the existing Weru 97 routing system.

## Implementation contract

- Map familiar aliases (including Windows Media Player) to installed Weru app IDs.
- Normalize quoted and relative paths to canonical `C:\` paths and resolve them through the virtual filesystem.
- Resolve an unqualified filename only when there is one exact match; ask for a full path when names collide.
- Route file nodes with `targetForNode`, preserving their configured app association.
- Allow only HTTP(S) web addresses and dispatch them synchronously from the user gesture so the browser may open a separate tab.
- Reject protected host/system-modifying commands such as `regedit` and `format c:`; this portfolio simulation must not invoke host commands.
- Ignore stale asynchronous VFS results after the user submits another command or closes Run.

## Verification boundary

Resolver tests cover aliases, path normalization, web URLs, unsafe schemes, protected commands, exact-name routing, duplicate-name errors, and missing paths. The dialog's visual parity and complete live control matrix remain partial; the independent Stitch source for the related dialog screen is not present. No localhost server is started for this slice.
