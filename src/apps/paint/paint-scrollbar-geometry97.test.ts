import { describe, expect, it } from 'vitest';
import { getScrollbarThumbOffset97, getScrollPositionFromThumbDrag97 } from './paint-scrollbar-geometry97';

describe('Paint scrollbar geometry', () => {
  it('maps scroll position to a bounded thumb offset', () => {
    expect(getScrollbarThumbOffset97(0, 800, 400, 70)).toBe(0);
    expect(getScrollbarThumbOffset97(400, 800, 400, 70)).toBe(165);
    expect(getScrollbarThumbOffset97(800, 800, 400, 70)).toBe(330);
    expect(getScrollbarThumbOffset97(0, 0, 400, 70)).toBe(0);
  });

  it('maps thumb pointer travel back to scroll position and clamps both ends', () => {
    expect(getScrollPositionFromThumbDrag97(0, 165, 800, 400, 70)).toBe(400);
    expect(getScrollPositionFromThumbDrag97(200, -1000, 800, 400, 70)).toBe(0);
    expect(getScrollPositionFromThumbDrag97(700, 1000, 800, 400, 70)).toBe(800);
    expect(getScrollPositionFromThumbDrag97(0, 20, 0, 400, 70)).toBe(0);
  });
});
