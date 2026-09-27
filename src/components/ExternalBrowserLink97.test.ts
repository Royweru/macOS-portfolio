import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ExternalBrowserLink97 from './ExternalBrowserLink97';

describe('ExternalBrowserLink97', () => {
  it('opens safe web destinations outside Weru 97 in an isolated browser tab', () => {
    const html = renderToStaticMarkup(createElement(ExternalBrowserLink97, {
      href: 'https://example.com/project',
      children: 'Live project',
    }));

    expect(html).toContain('href="https://example.com/project"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('Opens outside Weru 97 in a new browser tab');
    expect(html).toContain('Live project');
  });

  it('does not render an unsafe destination as a clickable link', () => {
    const html = renderToStaticMarkup(createElement(ExternalBrowserLink97, {
      href: 'javascript:alert(1)',
      children: 'Unsafe link',
    }));

    expect(html).toContain('<span>Unsafe link</span>');
    expect(html).not.toContain('href=');
  });
});
