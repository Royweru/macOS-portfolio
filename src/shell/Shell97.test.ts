import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Shell97 from './Shell97';

describe('Shell97 CRT layer', () => {
  it('renders the click-through source CRT overlay above the taskbar content', () => {
    const markup = renderToStaticMarkup(createElement(Shell97, {
      openInstances: [],
      focusedWindowId: null,
      onOpenTarget: () => undefined,
      onOpenWindow: () => undefined,
      onFocusWindow: () => undefined,
      children: createElement('div', { className: 'window-manager97' }, 'window layer'),
    }));

    const windowLayerIndex = markup.indexOf('class="window-manager97"');
    const dialogLayerIndex = markup.indexOf('class="shell97-dialog-layer" id="shell97-dialog-layer"');
    const taskbarIndex = markup.indexOf('aria-label="Weru 97 taskbar"');
    const crtIndex = markup.indexOf('class="shell97-crt-overlay"');
    expect(windowLayerIndex).toBeGreaterThan(-1);
    expect(dialogLayerIndex).toBeGreaterThan(windowLayerIndex);
    expect(taskbarIndex).toBeGreaterThan(dialogLayerIndex);
    expect(taskbarIndex).toBeGreaterThan(-1);
    expect(crtIndex).toBeGreaterThan(taskbarIndex);
    expect(markup.slice(crtIndex)).toMatch(/aria-hidden="true"/);
  });
});
