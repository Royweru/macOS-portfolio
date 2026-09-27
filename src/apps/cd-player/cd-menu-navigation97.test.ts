import { describe, expect, it } from 'vitest';
import { nextCdMenuItemIndex97 } from './cd-menu-navigation97';

describe('CD Player menu keyboard navigation', () => {
  it('moves with arrows and wraps at either end', () => {
    expect(nextCdMenuItemIndex97(3, 0, 'ArrowDown')).toBe(1);
    expect(nextCdMenuItemIndex97(3, 2, 'ArrowDown')).toBe(0);
    expect(nextCdMenuItemIndex97(3, 0, 'ArrowUp')).toBe(2);
    expect(nextCdMenuItemIndex97(3, -1, 'ArrowDown')).toBe(0);
    expect(nextCdMenuItemIndex97(3, -1, 'ArrowUp')).toBe(2);
  });

  it('supports Home/End and empty menus', () => {
    expect(nextCdMenuItemIndex97(4, 2, 'Home')).toBe(0);
    expect(nextCdMenuItemIndex97(4, 1, 'End')).toBe(3);
    expect(nextCdMenuItemIndex97(0, -1, 'ArrowDown')).toBe(-1);
  });
});
