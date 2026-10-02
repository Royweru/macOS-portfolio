import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type { WindowInstance } from '../features/os/os-types';
import { WINDOW_CONFIGS } from '../constants';
import type { WindowId } from '../types';
import { WIN97_ASSETS } from '../data/win97-assets';
import Window97 from './Window97';

const base: WindowInstance = { id: 'test', appId: 'explorer', mode: 'normal', x: 20, y: 30, width: 560, height: 410, zIndex: 1, title: 'Test', canClose: true, canMinimize: true, canMaximize: true };
const renderWindow = (instance: WindowInstance = base) => renderToStaticMarkup(createElement(Window97, { instance, isFocused: true, onClose: vi.fn(), onRequestDiscardConfirmation: vi.fn(), onMinimize: vi.fn(), onMaximize: vi.fn(), onFocus: vi.fn(), onMove: vi.fn(), onResize: vi.fn(), children: 'Window content' }));
const resizeStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'window97.css'), 'utf8');
const stitchStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'stitch97.css'), 'utf8');
const shellStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'shell97.css'), 'utf8');
const windowSource = readFileSync(join(process.cwd(), 'src', 'wm', 'Window97.tsx'), 'utf8');

describe('Window97 common controls', () => {
  it('keeps title dragging and all eight resize zones touch-safe', () => {
    const html = renderWindow();
    expect(html).toContain('class="window97-drag-surface" style="touch-action:none"');
    for (const edge of ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']) expect(html).toContain(`data-window-resize="${edge}"`);
    expect(html.match(/style="touch-action:none;user-select:none"/g)).toHaveLength(8);
  });
  it('does not let the parent window dismiss a title-context action before its click handler runs', () => {
    expect(windowSource).toContain('className="window97-title-context" role="menu" onPointerDown={event => event.stopPropagation()}');
  });
  it('keeps the invisible resize hit zones reachable above content without changing the window frame', () => {
    expect(resizeStyles).toContain('.window97-resize-n, .window97-resize-s { left: 10px; right: 10px; height: 8px;');
    expect(resizeStyles).toContain('.window97-resize-e, .window97-resize-w { top: 10px; bottom: 10px; width: 8px;');
    expect(resizeStyles).toContain('.window97-resize-ne, .window97-resize-sw, .window97-resize-nw, .window97-resize-se { width: 12px; height: 12px; }');
    expect(stitchStyles).toContain('.window97-resize { z-index: 20; pointer-events: auto; }');
    expect(windowSource).toMatch(/onPointerDown=\{\(event\) => resize\.start\(direction, event\)\}/);
    expect(windowSource).toContain('onPointerMove={resize.onPointerMove} onPointerUp={resize.onPointerUp}');
  });
  it('removes resize zones when maximized', () => expect(renderWindow({ ...base, mode: 'maximized' })).not.toContain('data-window-resize='));
  it('keeps maximized windows in a taskbar-safe, lower shell layer', () => {
    expect(resizeStyles).toContain('.window-manager97 { position: absolute; inset: 0 0 auto; height: calc(100% - var(--w95-taskbar-h, 30px)); z-index: 500; pointer-events: none; }');
    expect(shellStyles).toContain('.taskbar97 { position: absolute; inset: auto 0 0; z-index: 600;');
  });
  it.each(Object.keys(WINDOW_CONFIGS) as WindowId[])('renders expected controls for %s', appId => {
    const html = renderWindow({ ...base, id: `${appId}-test`, appId, title: WINDOW_CONFIGS[appId].title,
      ...(['cd-player', 'cd-equalizer'].includes(appId) ? { canMaximize: false } : {}),
      ...(appId === 'cd-equalizer' ? { showMaximize: false } : {}),
    });
    expect(html).toContain('data-window-control="close"');
    expect(html.match(/data-window-resize="/g)).toHaveLength(8);
    if (appId === 'system-properties') expect(html).not.toContain('data-window-control="minimize"');
    else expect(html).toContain('data-window-control="minimize"');
    if (appId === 'system-properties') expect(html).not.toContain('data-window-control="maximize"');
    else if (appId === 'cd-equalizer') expect(html).not.toContain('data-window-control="maximize"');
    else expect(html).toContain('data-window-control="maximize"');
    if (appId === 'cd-player') expect(html).toContain('data-window-control="maximize" aria-label="Maximize" disabled=""');
  });
  it('uses the source-sized monitor icon in the System Properties title bar', () => {
    const html = renderWindow({ ...base, appId: 'system-properties', title: 'System Properties' });

    expect(html).toContain(`src="${WIN97_ASSETS.icons.systemProperties}" width="14" height="14"`);
  });
  it('matches Stitch System Properties close-only titlebar while retaining window movement and resize', () => {
    const html = renderWindow({ ...base, appId: 'system-properties', title: 'System Properties' });
    expect(html).toContain('data-window-control="close"');
    expect(html).not.toContain('data-window-control="minimize"');
    expect(html).not.toContain('data-window-control="maximize"');
    expect(html.match(/data-window-resize="/g)).toHaveLength(8);
  });
  it('omits controls explicitly disabled by a window', () => {
    const html = renderWindow({ ...base, canClose: false, canMinimize: false, canMaximize: false, showMaximize: false });
    expect(html).not.toContain('data-window-control="close"');
    expect(html).not.toContain('data-window-control="minimize"');
    expect(html).not.toContain('data-window-control="maximize"');
  });
});
