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
    }));

    const taskbarIndex = markup.indexOf('aria-label="Weru 97 taskbar"');
    const crtIndex = markup.indexOf('class="shell97-crt-overlay"');
    expect(taskbarIndex).toBeGreaterThan(-1);
    expect(crtIndex).toBeGreaterThan(taskbarIndex);
    expect(markup.slice(crtIndex)).toMatch(/aria-hidden="true"/);
  });
});
