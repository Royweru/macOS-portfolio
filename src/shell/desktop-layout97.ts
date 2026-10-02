import type { OpenTarget } from '../features/os/os-types';

export const DESKTOP97_ICON_TOP = 12;
// Stitch's source tiles occupy roughly 56px vertically, with a 16px row gap.
// Weru keeps the requested 40px pixel art in a compact 60px hit cell, leaving
// 12px between cells while preserving the source's 72px column-flow cadence.
export const DESKTOP97_ICON_ROW_PITCH = 72;
export const DESKTOP97_ICON_COLUMN_PITCH = 96;
export const DESKTOP97_LEGACY_ICON_ROW_PITCH = 88;

export function getDesktopShortcutPosition97(index: number, desktopHeight: number) {
  const rowsPerColumn = Math.max(1, Math.floor((desktopHeight - DESKTOP97_ICON_TOP) / DESKTOP97_ICON_ROW_PITCH));
  return {
    left: 12 + Math.floor(index / rowsPerColumn) * DESKTOP97_ICON_COLUMN_PITCH,
    top: DESKTOP97_ICON_TOP + (index % rowsPerColumn) * DESKTOP97_ICON_ROW_PITCH,
  };
}

/** Make the focused desktop shortcut open like Enter on a classic desktop. */
export function activateDesktopShortcutOnKey97(
  event: Pick<KeyboardEvent, 'key' | 'preventDefault' | 'stopPropagation'>,
  open: () => void,
) {
  if (event.key !== 'Enter') return false;
  event.preventDefault();
  event.stopPropagation();
  open();
  return true;
}

/** Route the two source-backed desktop Properties actions to real Weru surfaces. */
export function getDesktopPropertiesTarget97(shortcutId?: string): OpenTarget | undefined {
  if (!shortcutId) return { kind: 'application', appId: 'control-panel' };
  if (shortcutId === 'shortcut-my-computer') return { kind: 'application', appId: 'system-properties' };
  return undefined;
}
