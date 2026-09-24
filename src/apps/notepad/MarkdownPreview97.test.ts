import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MarkdownPreview97 from './MarkdownPreview97';

describe('MarkdownPreview97', () => {
  it('renders README headings, GFM tables, and safe live-link targets', () => {
    const html = renderToStaticMarkup(createElement(MarkdownPreview97, {
      source: '# Project\n\n| Layer | Tool |\n| --- | --- |\n| UI | React |\n\n[Live site](https://example.com/demo)',
      onOpenTarget: () => undefined,
    }));

    expect(html).toContain('<h1>Project</h1>');
    expect(html).toContain('<table>');
    expect(html).toContain('<td>React</td>');
    expect(html).toContain('href="https://example.com/demo"');
    expect(html).not.toContain('target="_blank"');
  });

  it('does not render unsafe or non-local image URLs as active links', () => {
    const html = renderToStaticMarkup(createElement(MarkdownPreview97, {
      source: '[unsafe](javascript:alert(1))\n\n![remote](https://example.com/tracker.png)',
    }));

    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('<img');
  });
});
