import type { OpenTarget } from '../features/os/os-types';

export const DESKTOP97_ICON_TOP = 12;
// Stitch uses a column-first vertical flow with a 16px row gap. The supplied
// Weru icons are intentionally larger (40px art), so 80px preserves that gap
// while letting the layout wrap naturally at shorter browser heights.
export const DESKTOP97_ICON_ROW_PITCH = 80;
export const DESKTOP97_ICON_COLUMN_PITCH = 96;
export const DESKTOP97_LEGACY_ICON_ROW_PITCH = 88;

export function getDesktopShortcutPosition97(index: number, desktopHeight: number) {
  const rowsPerColumn = Math.max(1, Math.floor((desktopHeight - DESKTOP97_ICON_TOP) / DESKTOP97_ICON_ROW_PITCH));
  return {
    left: 12 + Math.floor(index / rowsPerColumn) * DESKTOP97_ICON_COLUMN_PITCH,
    top: DESKTOP97_ICON_TOP + (index % rowsPerColumn) * DESKTOP97_ICON_ROW_PITCH,
  };
}

/** Route the two source-backed desktop Properties actions to real Weru surfaces. */
export function getDesktopPropertiesTarget97(shortcutId?: string): OpenTarget | undefined {
  if (!shortcutId) return { kind: 'application', appId: 'control-panel' };
  if (shortcutId === 'shortcut-my-computer') return { kind: 'application', appId: 'system-properties' };
  return undefined;
}
