import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import Paint97 from './Paint97';
import { PAINT_MENU_ITEMS97, PAINT_MENU_NAMES97 } from './paint-menus97';
import { PAINT_PALETTE97 } from './paint-palette97';
import { boundsForPoints97, containedImageRect97, drawShape97, floodFill97, getPaintColorForTool97, selectPaintSwatch97 } from './paint-geometry97';

const stitchPaintSource = readFileSync(join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_paint.html'), 'utf8');
const paintStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'stitch97.css'), 'utf8');
const paintComponent = readFileSync(join(process.cwd(), 'src', 'apps', 'paint', 'Paint97.tsx'), 'utf8');

describe('Paint97 Stitch toolbox and canvas controls', () => {
  it('replaces Stitch menu captions with accessible functional menu triggers and command handlers', () => {
    const html = renderToStaticMarkup(createElement(Paint97));
    const sourceMenu = stitchPaintSource.slice(stitchPaintSource.indexOf('<!-- Menu Bar -->'), stitchPaintSource.indexOf('<!-- App Body: Toolset'));

    expect(sourceMenu).toContain('<span class="underline">F</span>ile');
    expect(sourceMenu).toContain('<span class="underline">H</span>elp');
    expect(html).toContain('role="menubar" aria-label="Paint menus"');
    for (const name of PAINT_MENU_NAMES97) {
      const triggerId = html.match(new RegExp(`id="(win97-paint-[^"]+-menu-trigger-${name})"`))?.[1];
      expect(triggerId).toBeTruthy();
      expect(html).toContain(`aria-controls="${triggerId?.replace('-menu-trigger-', '-menu-')}"`);
    }
    for (const entry of Object.values(PAINT_MENU_ITEMS97).flat()) {
      if ('separator' in entry) continue;
      expect(paintComponent).toContain(`case '${entry.action}'`);
    }
    expect(paintStyles).toMatch(/\.win97-paint-menubar\s*\{[^}]*height:\s*19px/);
    expect(paintStyles).toContain('.win97-paint-menu-popup > button:disabled');
  });

  it('gives simultaneous Paint windows independent menu and dialog identifiers', () => {
    const html = renderToStaticMarkup(createElement('div', null, createElement(Paint97), createElement(Paint97)));
    const triggerIds = [...html.matchAll(/id="(win97-paint-[^"]+-menu-trigger-File)"/g)].map(([, id]) => id);
    expect(triggerIds).toHaveLength(2);
    expect(new Set(triggerIds).size).toBe(2);
  });

  it('renders the source-oriented 2×8 left toolbox and four brush-size options', () => {
    const html = renderToStaticMarkup(createElement(Paint97));

    expect(html).toContain('class="win97-paint-toolbox" aria-label="Paint toolbox"');
    expect(html).toContain('aria-label="Free-Form Select"');
    expect(html).toContain('aria-label="Rounded Rectangle"');
    expect(html).toContain('role="group" aria-label="Brush size"');
    for (const size of [1, 2, 3, 4]) expect(html).toContain(`aria-label="Brush size ${size} px"`);
    expect(html).toContain('class="win97-paint-canvas-viewport"');
    expect(html).toContain('aria-label="Horizontal drawing scrollbar"');
    expect(html).toContain('aria-label="Vertical drawing scrollbar"');
    expect(html).not.toContain('class="win97-paint-toolbar"');
    expect(html).not.toContain('win97-paint-memo');
  });

  it('keeps the source wireframe note inside the art and omits the extra memo overlay', () => {
    const html = renderToStaticMarkup(createElement(Paint97));
    expect(html).toContain('class="win97-paint-specs"');
    expect(html).toContain('Use pencil tool to touch up anti-aliasing');
    expect(html).not.toContain('System Memo');
  });

  it('exposes a live canvas-coordinate segment and accessible color states', () => {
    const html = renderToStaticMarkup(createElement(Paint97));

    expect(html).toContain('aria-live="polite">⌖ 320, 240px</span>');
    expect(html).toContain('aria-label="Set foreground to #000000; right-click to set background" aria-pressed="true"');
    expect(html).toContain('aria-label="Paint canvas"');
    expect(html).toContain('aria-label="Foreground color #000000; background color #ffffff"');
    expect(html).toContain('right-click to set background');
  });

  it('uses separate primary and secondary colors for left/right mouse input', () => {
    expect(getPaintColorForTool97('pencil', 0, '#123456', '#abcdef')).toBe('#123456');
    expect(getPaintColorForTool97('pencil', 2, '#123456', '#abcdef')).toBe('#abcdef');
    expect(getPaintColorForTool97('eraser', 0, '#123456', '#abcdef')).toBe('#abcdef');
    expect(getPaintColorForTool97('eraser', 2, '#123456', '#abcdef')).toBe('#abcdef');
    expect(selectPaintSwatch97(0, '#ff0000', '#000000', '#ffffff')).toEqual({ primary: '#ff0000', secondary: '#ffffff' });
    expect(selectPaintSwatch97(2, '#00ff00', '#000000', '#ffffff')).toEqual({ primary: '#000000', secondary: '#00ff00' });
  });

  it('matches and renders Stitch’s exact ordered 28-color palette', () => {
    const paletteStart = stitchPaintSource.indexOf('<!-- 28 Classic Windows 95/97 Palette Swatches');
    const statusStart = stitchPaintSource.indexOf('<!-- Window Status Bar -->', paletteStart);
    expect(paletteStart).toBeGreaterThanOrEqual(0);
    expect(statusStart).toBeGreaterThan(paletteStart);
    const sourcePalette = stitchPaintSource.slice(paletteStart, statusStart);
    const sourceColors = [...sourcePalette.matchAll(/bg-\[#([\da-f]{6})\]/gi)].map(([, value]) => `#${value.toLowerCase()}`);
    const markup = renderToStaticMarkup(createElement(Paint97));
    const renderedColors = [...markup.matchAll(/aria-label="Set foreground to (#[\da-f]{6}); right-click to set background"/gi)].map(([, value]) => value.toLowerCase());

    expect(sourceColors).toHaveLength(28);
    expect(sourcePalette).toContain('grid grid-rows-2 grid-flow-col gap-[2px]');
    expect(paintStyles).toMatch(/\.win97-paint-swatches\s*\{[^}]*grid-template-rows:\s*repeat\(2,\s*14px\);[^}]*grid-auto-flow:\s*column/);
    expect(PAINT_PALETTE97).toEqual(sourceColors);
    expect(renderedColors).toEqual(sourceColors);
    expect(markup).toContain('aria-label="Foreground color #000000; background color #ffffff"');
  });

  it('places an opened image below the annotation canvas at the source drawing size', () => {
    const html = renderToStaticMarkup(createElement(Paint97, {
      asset: { id: 'photo', projectId: 1, kind: 'image', title: 'Project image', source: '/media/pictures/project.png', mimeType: 'image/png' },
    }));

    expect(html).toContain('src="/media/pictures/project.png" alt="Project image"');
    expect(html).toContain('class="win97-paint-sheet-frame" style="width:580px;height:340px"');
    expect(html).toContain('class="win97-paint-sheet" style="transform:scale(1)"');
    expect(html).toContain('width="580" height="340"');
  });

  it('contains source images without stretching and bounds free-form paths', () => {
    expect(containedImageRect97(1920, 1080, 580, 340)).toEqual({ x: 0, y: 7, width: 580, height: 326 });
    expect(boundsForPoints97([{ x: 40, y: 80 }, { x: 15, y: 30 }, { x: 60, y: 55 }])).toEqual({ x: 15, y: 30, width: 46, height: 51 });
  });

  it('flood-fills a four-connected region without crossing color boundaries', () => {
    const pixels = new Uint8ClampedArray([
      0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255,
      0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255,
      0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    ]);
    expect(floodFill97(pixels, 3, 3, 0, 0, [0, 0, 255, 255])).toBe(5);
    expect(Array.from(pixels.slice(0, 4))).toEqual([0, 0, 255, 255]);
    expect(Array.from(pixels.slice(8, 12))).toEqual([255, 255, 255, 255]);
    expect(floodFill97(pixels, 3, 3, 0, 0, [0, 0, 255, 255])).toBe(0);
    expect(floodFill97(pixels, 3, 3, -1, 0, [0, 0, 0, 255])).toBe(0);
  });

  it.each([
    ['line', 'lineTo'],
    ['curve', 'quadraticCurveTo'],
    ['rectangle', 'rect'],
    ['polygon', 'closePath'],
    ['ellipse', 'ellipse'],
    ['roundrect', 'roundRect'],
  ])('draws a %s from the pointer start to the current point', (tool, expectedMethod) => {
    const context = {
      beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), quadraticCurveTo: vi.fn(),
      ellipse: vi.fn(), closePath: vi.fn(), roundRect: vi.fn(), rect: vi.fn(), stroke: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawShape97(context, tool, { x: 20, y: 30 }, { x: 60, y: 90 });

    expect(context.beginPath).toHaveBeenCalledOnce();
    expect(context[expectedMethod as keyof CanvasRenderingContext2D]).toHaveBeenCalled();
    expect(context.stroke).toHaveBeenCalledOnce();
  });
});
