import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getIe4InitialRect97 } from './ie4-window-geometry97';

const stitchIeSource = readFileSync(
  join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_internet_explorer.html'),
  'utf8',
);

describe('Internet Explorer Stitch initial window geometry', () => {
  it('uses the padded source content column and 96% source height at the matched viewport', () => {
    expect(stitchIeSource).toContain('pl-20 h-full w-full');
    expect(stitchIeSource).toContain('h-[calc(100vh-42px)] flex items-center justify-center p-2');
    expect(stitchIeSource).toContain('w-[940px] max-w-[98%] h-[680px] max-h-[96%]');
    expect(getIe4InitialRect97(0, { width: 1422, workAreaHeight: 598, viewportHeight: 644 })).toEqual({
      x: 281,
      y: 28,
      width: 940,
      height: 563,
    });
  });

  it('keeps the IE window to the right of Weru shortcuts on narrower screens', () => {
    const bounds = { width: 900, workAreaHeight: 620, viewportHeight: 666 };
    const rect = getIe4InitialRect97(0, bounds);
    expect(rect.x).toBeGreaterThanOrEqual(240);
    expect(rect.x + rect.width).toBeLessThanOrEqual(bounds.width);
    expect(rect.y + rect.height).toBeLessThanOrEqual(bounds.workAreaHeight);
  });

  it('cascades independent IE windows without allowing them under the taskbar', () => {
    const bounds = { width: 1422, workAreaHeight: 598, viewportHeight: 644 };
    const first = getIe4InitialRect97(0, bounds);
    const second = getIe4InitialRect97(44, bounds);
    expect(second.x).toBe(first.x + 44);
    expect(second.y + second.height).toBeLessThanOrEqual(bounds.workAreaHeight);
    expect(second.x + second.width).toBeLessThanOrEqual(bounds.width);
  });
});
