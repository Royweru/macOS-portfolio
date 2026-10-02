# System Properties Tabs — Live Verification

## Scope

Verify the existing four-tab System Properties implementation against available evidence in Stitch screen `ac63fe5b9e0a43e29ebf1bc4e9ebfba7`.

## Source comparison

- Reused the existing Chrome-extension tab to compare the raw retained HTML and current Weru app sequentially at 1422×644.
- The source screen shows the General panel and static labels for General, Device Manager, Hardware Profiles, and Performance.
- The live General window is centered and measures 460×420, matching the source dialog geometry. Weru 97 and Roy Weru replace the sample operating-system and owner strings by explicit product direction.
- The raw fixture does not expose separate source content or interaction for the other tabs; no pixel-parity claim is made for those panels.

## Live interaction evidence

- Opened System Properties through the My Computer context menu.
- ArrowRight moved the selected tab from General through Device Manager, Hardware Profiles, and Performance, then wrapped to General.
- Accessibility output confirmed each panel's heading and content: device list; profile radio choices; performance resource gauges.
- A screenshot confirmed the rendered Performance panel.
- Closed the test-opened Properties window; other persisted windows were left open and unchanged.

## Remaining work

This closes the four-tab behavior check only. System Properties/Control Panel visual parity remains partial, including a separate Control Panel comparison, exact internal spacing/states, and Recycle Bin alert comparison. The overall dialog screen remains partial.
