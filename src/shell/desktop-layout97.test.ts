import { describe, expect, it } from 'vitest';
import { getDesktopShortcutPosition97 } from './desktop-layout97';

describe('Stitch desktop shortcut flow', () => {
  it('keeps the Stitch column-first order and uses a second column when the viewport is short', () => {
    expect(getDesktopShortcutPosition97(6, 596)).toEqual({ left: 12, top: 492 });
    expect(getDesktopShortcutPosition97(7, 596)).toEqual({ left: 108, top: 12 });
    expect(getDesktopShortcutPosition97(8, 596)).toEqual({ left: 108, top: 92 });
  });

  it('keeps all nine icons in the first column when the available desktop height permits it', () => {
    expect(getDesktopShortcutPosition97(8, 912)).toEqual({ left: 12, top: 652 });
  });

  it('wraps earlier when the viewport is narrower or shorter without reordering shortcuts', () => {
    expect(getDesktopShortcutPosition97(5, 524)).toEqual({ left: 12, top: 412 });
    expect(getDesktopShortcutPosition97(6, 524)).toEqual({ left: 108, top: 12 });
  });
});
