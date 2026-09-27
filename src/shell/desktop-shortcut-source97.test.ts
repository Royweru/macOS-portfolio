import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import DesktopIconArt97 from './DesktopIconArt97';
import { STITCH_SHORTCUT_ORDER97 } from './Desktop97';
import { DESKTOP97_ICON_COLUMN_PITCH, DESKTOP97_ICON_ROW_PITCH, getDesktopShortcutPosition97 } from './desktop-layout97';

const source = readFileSync(join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_os_desktop.html'), 'utf8');

describe('desktop shortcuts against the preserved Stitch desktop source', () => {
  it('preserves all nine source shortcut positions in order, then appends Outlook Express', () => {
    const sourceOrder = [...source.matchAll(/<div class="desktop-icon[^"]*"[^>]*data-icon-id="([^"]+)"/g)]
      .map(([, id]) => `shortcut-${({ pictures: 'my-pictures', ie: 'internet' } as Record<string, string>)[id] ?? id}`);

    expect(sourceOrder).toHaveLength(9);
    expect(STITCH_SHORTCUT_ORDER97.slice(0, sourceOrder.length)).toEqual(sourceOrder);
    expect(STITCH_SHORTCUT_ORDER97.slice(sourceOrder.length)).toEqual(['shortcut-outlook-express']);
  });

  it('keeps the intentionally enlarged pixel art and column spacing collision-free', () => {
    expect(source).toContain('viewbox="0 0 32 32"');
    for (const iconId of STITCH_SHORTCUT_ORDER97) {
      const markup = renderToStaticMarkup(createElement(DesktopIconArt97, { iconId }));
      expect(markup).toContain('width="40" height="40" viewBox="0 0 32 32"');
    }

    expect(DESKTOP97_ICON_ROW_PITCH).toBe(80);
    expect(DESKTOP97_ICON_COLUMN_PITCH).toBe(96);
    const recycle = getDesktopShortcutPosition97(8, 722);
    const mail = getDesktopShortcutPosition97(9, 722);
    expect(recycle).toEqual({ left: 108, top: 12 });
    expect(mail).toEqual({ left: 108, top: 92 });
    expect(mail.top).toBeGreaterThanOrEqual(recycle.top + 72);
  });

  it('keeps every built-in shortcut, especially Games/Recycle Bin/Outlook, collision-free at reported desktop heights', () => {
    for (const desktopHeight of [596, 722, 912]) {
      const cells = STITCH_SHORTCUT_ORDER97.map((id, index) => ({
        id,
        ...getDesktopShortcutPosition97(index, desktopHeight),
        width: 88,
        height: 72,
      }));
      for (let leftIndex = 0; leftIndex < cells.length; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < cells.length; rightIndex += 1) {
          const left = cells[leftIndex];
          const right = cells[rightIndex];
          const overlaps = left.left < right.left + right.width
            && left.left + left.width > right.left
            && left.top < right.top + right.height
            && left.top + left.height > right.top;
          expect(overlaps, `${left.id} and ${right.id} at ${desktopHeight}px`).toBe(false);
        }
      }
      if (desktopHeight === 596) {
        expect(cells.find(cell => cell.id === 'shortcut-games')).toMatchObject({ left: 108, top: 12 });
        expect(cells.find(cell => cell.id === 'shortcut-recycle-bin')).toMatchObject({ left: 108, top: 92 });
        expect(cells.find(cell => cell.id === 'shortcut-outlook-express')).toMatchObject({ left: 108, top: 172 });
      }
    }
  });
});
