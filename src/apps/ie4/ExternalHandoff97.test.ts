import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ExternalHandoff97 from './ExternalHandoff97';

describe('ExternalHandoff97', () => {
  it('provides a native safe-link retry for a blocked scripted handoff', () => {
    const html = renderToStaticMarkup(createElement(ExternalHandoff97, {
      status: 'The browser blocked the new tab. Use Open in browser to continue.',
      href: 'https://example.com/project',
    }));

    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('href="https://example.com/project" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('Open in browser');
  });

  it('does not render a retry when there is no external handoff', () => {
    const html = renderToStaticMarkup(createElement(ExternalHandoff97, { status: 'Done', href: null }));
    expect(html).not.toContain('Open in browser');
    expect(html).toContain('Done');
  });
});
