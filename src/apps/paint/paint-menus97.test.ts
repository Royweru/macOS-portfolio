import { describe, expect, it } from 'vitest';
import { PAINT_MENU_ITEMS97, PAINT_MENU_NAMES97, isPaintMenuActionDisabled97 } from './paint-menus97';

describe('Paint 97 menu command contract', () => {
  it('matches the six menu headings and provides a command for every non-separator item', () => {
    expect(PAINT_MENU_NAMES97).toEqual(['File', 'Edit', 'View', 'Image', 'Options', 'Help']);
    for (const name of PAINT_MENU_NAMES97) {
      expect(PAINT_MENU_ITEMS97[name].length).toBeGreaterThan(0);
      expect(PAINT_MENU_ITEMS97[name].every(entry => 'separator' in entry || Boolean(entry.action))).toBe(true);
    }
  });

  it('disables history and clipboard commands until their state is available', () => {
    const empty = { canUndo: false, canRedo: false, hasSelection: false, hasClipboard: false };
    expect(isPaintMenuActionDisabled97('undo', empty)).toBe(true);
    expect(isPaintMenuActionDisabled97('redo', empty)).toBe(true);
    expect(isPaintMenuActionDisabled97('cut', empty)).toBe(true);
    expect(isPaintMenuActionDisabled97('copy', empty)).toBe(true);
    expect(isPaintMenuActionDisabled97('delete', empty)).toBe(true);
    expect(isPaintMenuActionDisabled97('paste', empty)).toBe(true);
    expect(isPaintMenuActionDisabled97('save', empty)).toBe(false);

    const ready = { canUndo: true, canRedo: true, hasSelection: true, hasClipboard: true };
    for (const action of ['undo', 'redo', 'cut', 'copy', 'paste', 'delete'] as const) {
      expect(isPaintMenuActionDisabled97(action, ready)).toBe(false);
    }
  });
});
