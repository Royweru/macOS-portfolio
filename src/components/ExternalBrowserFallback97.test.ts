import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import ExternalBrowserFallback97 from './ExternalBrowserFallback97';

describe('ExternalBrowserFallback97', () => {
  it('exposes the blocked destination as an accessible native new-tab retry', () => {
    const html = renderToStaticMarkup(createElement(ExternalBrowserFallback97, {
      href: 'https://example.com/project',
      label: 'Live project',
      onDismiss: vi.fn(),
    }));

    expect(html).toContain('role="alert" aria-label="External browser link blocked"');
    expect(html).toContain('Your browser blocked the new tab.');
    expect(html).toContain('href="https://example.com/project" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('Open Live project in browser');
    expect(html).toContain('>Close</button>');
  });
});
