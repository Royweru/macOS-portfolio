import { describe, expect, it } from 'vitest';
import { resizeRectFromPointer97, type ResizeDirection97 } from './useResize97';

describe('window resize pointer geometry', () => {
  const start = { x: 100, y: 80, width: 400, height: 300 };
  const movement = { dx: 25, dy: 35 };

  it.each([
    ['n', { x: 100, y: 115, width: 400, height: 265 }],
    ['e', { x: 100, y: 80, width: 425, height: 300 }],
    ['s', { x: 100, y: 80, width: 400, height: 335 }],
    ['w', { x: 125, y: 80, width: 375, height: 300 }],
    ['ne', { x: 100, y: 115, width: 425, height: 265 }],
    ['nw', { x: 125, y: 115, width: 375, height: 265 }],
    ['se', { x: 100, y: 80, width: 425, height: 335 }],
    ['sw', { x: 125, y: 80, width: 375, height: 335 }],
  ] satisfies Array<[ResizeDirection97, typeof start]>)('resizes from the %s handle', (direction, expected) => {
    expect(resizeRectFromPointer97(start, direction, movement.dx, movement.dy, 240, 160)).toEqual(expected);
  });

  it('keeps the opposite edge anchored when west or north is dragged beyond the desktop origin', () => {
    const west = resizeRectFromPointer97(start, 'w', -150, 0, 240, 160);
    const north = resizeRectFromPointer97(start, 'n', 0, -120, 240, 160);

    expect(west).toEqual({ x: 0, y: 80, width: 500, height: 300 });
    expect(west.x + west.width).toBe(start.x + start.width);
    expect(north).toEqual({ x: 100, y: 0, width: 400, height: 380 });
    expect(north.y + north.height).toBe(start.y + start.height);
  });

  it('enforces minimum size while retaining the fixed opposite edge', () => {
    const west = resizeRectFromPointer97(start, 'w', 500, 0, 240, 160);
    const north = resizeRectFromPointer97(start, 'n', 0, 500, 240, 160);

    expect(west).toEqual({ x: 260, y: 80, width: 240, height: 300 });
    expect(west.x + west.width).toBe(start.x + start.width);
    expect(north).toEqual({ x: 100, y: 220, width: 400, height: 160 });
    expect(north.y + north.height).toBe(start.y + start.height);
  });
});
