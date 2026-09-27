import { describe, expect, it, vi } from 'vitest';
import { isAllowedExternalUrl, openExternalUrlInNewTab, targetForNode } from './open-target';

describe('open target safety', () => {
  it('allows valid web URLs and rejects invalid protocols', () => {
    expect(isAllowedExternalUrl('https://github.com/weruroy')).toBe(true);
    expect(isAllowedExternalUrl('https://estore-ivory.vercel.app')).toBe(true);
    expect(isAllowedExternalUrl('http://custom-domain.com')).toBe(true);
    expect(isAllowedExternalUrl('javascript:alert(1)')).toBe(false);
    expect(isAllowedExternalUrl('not-a-url')).toBe(false);
  });

  it('turns URL files into explicit external targets', () => {
    expect(targetForNode({ id: 'url', parentId: 'project', name: 'Repository.url', kind: 'file', mimeType: 'text/uri-list', content: 'https://github.com/weruroy', size: 24, createdAt: '', updatedAt: '' })).toEqual({ kind: 'external', url: 'https://github.com/weruroy', label: 'Repository.url' });
  });

  it('opens allowed external destinations in a detached no-referrer top-level tab', () => {
    const order: string[] = [];
    const meta = { name: '', content: '' };
    const popup = {
      document: { createElement: vi.fn(() => meta), head: { append: vi.fn(() => order.push('referrer-policy')) } },
      location: { replace: vi.fn(() => order.push('navigate')) },
      close: vi.fn(),
    } as unknown as Window;
    Object.defineProperty(popup, 'opener', {
      configurable: true,
      get: () => null,
      set: (value: Window | null) => { order.push(value === null ? 'detach-opener' : 'attach-opener'); },
    });
    const open = vi.fn(() => popup);
    vi.stubGlobal('window', { open });

    expect(openExternalUrlInNewTab('https://github.com/Royweru')).toBe(true);
    expect(open).toHaveBeenCalledWith('about:blank', '_blank');
    expect(meta).toEqual({ name: 'referrer', content: 'no-referrer' });
    expect(order).toEqual(['referrer-policy', 'detach-opener', 'navigate']);
    expect(popup.location.replace).toHaveBeenCalledWith('https://github.com/Royweru');
    vi.unstubAllGlobals();
  });

  it('reports a blocked browser tab so the caller can show a native link fallback', () => {
    const open = vi.fn(() => null);
    vi.stubGlobal('window', { open });

    expect(openExternalUrlInNewTab('https://github.com/Royweru')).toBe(false);
    expect(open).toHaveBeenCalledWith('about:blank', '_blank');
    vi.unstubAllGlobals();
  });

  it('does not open an unsafe URL', () => {
    const open = vi.fn();
    vi.stubGlobal('window', { open });

    expect(openExternalUrlInNewTab('javascript:alert(1)')).toBe(false);
    expect(open).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
