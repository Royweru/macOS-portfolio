import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import TitleBar95 from '../components/win95/TitleBar95';

const titleBarSource = readFileSync(join(process.cwd(), 'src', 'components', 'win95', 'TitleBar95.tsx'), 'utf8');

describe('source-specific maximize control rendering', () => {
  it('keeps the CD Player maximize control visible but disabled', () => {
    const html = renderToStaticMarkup(createElement(TitleBar95, { title: 'CD Player', maximizeDisabled: true }));
    expect(html).toContain('data-window-control="maximize"');
    expect(html).toContain('disabled=""');
  });

  it('omits maximize from the Graphic Equalizer titlebar', () => {
    const html = renderToStaticMarkup(createElement(TitleBar95, { title: 'Now Playing - Graphic Equalizer', showMaximize: false }));
    expect(html).not.toContain('data-window-control="maximize"');
  });

  it('keeps double-clicks on titlebar controls from triggering the title maximize gesture', () => {
    expect(titleBarSource).toMatch(/className="win95-titlebar-controls"[^\r\n]*onDoubleClick=\{\(event\) => event\.stopPropagation\(\)\}/);
  });
});
