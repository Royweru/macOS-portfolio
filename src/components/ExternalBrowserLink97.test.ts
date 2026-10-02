import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import ExternalBrowserLink97 from './ExternalBrowserLink97';
import { handleExternalBrowserLinkClick97 } from './external-browser-navigation97';

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

  it('prevents in-shell navigation and reports a popup block for an external destination', () => {
    const event = { defaultPrevented: false, preventDefault: vi.fn() };
    const open = vi.fn(() => false);
    const onBlocked = vi.fn();

    handleExternalBrowserLinkClick97(event, 'https://example.com/project', onBlocked, open);

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledWith('https://example.com/project');
    expect(onBlocked).toHaveBeenCalledOnce();
  });

  it('keeps a successful new-tab handoff out of the Weru shell without showing the fallback', () => {
    const event = { defaultPrevented: false, preventDefault: vi.fn() };
    const open = vi.fn(() => true);
    const onBlocked = vi.fn();

    handleExternalBrowserLinkClick97(event, 'https://example.com/project', onBlocked, open);

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledWith('https://example.com/project');
    expect(onBlocked).not.toHaveBeenCalled();
  });

  it('does not override a caller that already prevented the anchor action', () => {
    const event = { defaultPrevented: true, preventDefault: vi.fn() };
    const open = vi.fn(() => true);
    const onBlocked = vi.fn();

    handleExternalBrowserLinkClick97(event, 'https://example.com/project', onBlocked, open);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(onBlocked).not.toHaveBeenCalled();
  });
});
