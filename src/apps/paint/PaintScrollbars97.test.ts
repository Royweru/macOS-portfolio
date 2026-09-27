import { createElement, createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PaintScrollbars97 from './PaintScrollbars97';

describe('PaintScrollbars97 Stitch chrome', () => {
  it('renders horizontal and vertical classic tracks, arrows, and accessible thumbs', () => {
    const html = renderToStaticMarkup(createElement(PaintScrollbars97, { viewportRef: createRef<HTMLDivElement>() }));
    expect(html).toContain('class="win97-paint-scrollbar-h"');
    expect(html).toContain('class="win97-paint-scrollbar-v"');
    expect(html).toContain('aria-label="Scroll drawing left"');
    expect(html).toContain('aria-label="Scroll drawing right"');
    expect(html).toContain('aria-label="Scroll drawing up"');
    expect(html).toContain('aria-label="Scroll drawing down"');
    expect(html).toContain('role="scrollbar" aria-label="Horizontal drawing position" aria-orientation="horizontal"');
    expect(html).toContain('role="scrollbar" aria-label="Vertical drawing position" aria-orientation="vertical"');
  });
});
