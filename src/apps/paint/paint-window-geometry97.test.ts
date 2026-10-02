import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPaintInitialRect97 } from './paint-window-geometry97';

const stitchPaintSource = readFileSync(
  join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_paint.html'),
  'utf8',
);

describe('Paint Stitch initial window geometry', () => {
  it('uses the source content column and top inset at the matched wide viewport', () => {
    expect(stitchPaintSource).toContain('bottom-[28px] w-20');
    expect(stitchPaintSource).toContain('pl-20 pr-space-lg pt-space-lg pb-[36px]');
    expect(stitchPaintSource).toContain('items-center justify-center p-gutter');
    expect(stitchPaintSource).toContain('max-w-[840px]');
    expect(getPaintInitialRect97(0, { width: 1422, workAreaHeight: 598, viewportHeight: 644 })).toEqual({
      x: 323,
      y: 16,
      width: 840,
      height: 478,
    });
  });

  it('keeps the Paint window visible on narrow and short work areas', () => {
    const bounds = { width: 720, workAreaHeight: 420, viewportHeight: 466 };
    const rect = getPaintInitialRect97(0, bounds);
    expect(rect.x).toBeGreaterThanOrEqual(0);
    expect(rect.y).toBeGreaterThanOrEqual(0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(bounds.width);
    expect(rect.y + rect.height).toBeLessThanOrEqual(bounds.workAreaHeight);
  });

  it('cascades independent Paint instances without leaving the desktop work area', () => {
    const bounds = { width: 1422, workAreaHeight: 598, viewportHeight: 644 };
    const first = getPaintInitialRect97(0, bounds);
    const second = getPaintInitialRect97(44, bounds);
    expect(second.x).toBe(first.x + 44);
    expect(second.y).toBe(first.y + 44);
    expect(second.x + second.width).toBeLessThanOrEqual(bounds.width);
    expect(second.y + second.height).toBeLessThanOrEqual(bounds.workAreaHeight);
  });
});
