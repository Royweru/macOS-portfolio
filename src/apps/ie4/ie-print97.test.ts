import { describe, expect, it, vi } from 'vitest';
import { mountIePrintSurface97 } from './ie-print97';

describe('IE4 print surface', () => {
  it('mounts a detached page clone and disposes it idempotently', () => {
    const clone = { nodeName: 'MAIN' } as unknown as Node;
    const page = { cloneNode: vi.fn(() => clone) } as unknown as HTMLElement;
    const surface = {
      className: '',
      append: vi.fn(),
      remove: vi.fn(),
    } as unknown as HTMLElement;
    const body = { append: vi.fn() } as unknown as HTMLElement;
    const document = {
      querySelectorAll: vi.fn(() => []),
      createElement: vi.fn(() => surface),
      body,
    } as unknown as Document;

    const dispose = mountIePrintSurface97(page, document);

    expect(page.cloneNode).toHaveBeenCalledWith(true);
    expect(surface.className).toBe('weru97-ie-print-surface');
    expect(surface.append).toHaveBeenCalledWith(clone);
    expect(body.append).toHaveBeenCalledWith(surface);

    dispose();
    dispose();
    expect(surface.remove).toHaveBeenCalledTimes(1);
  });

  it('removes a stale print surface before mounting the next page', () => {
    const staleSurface = { remove: vi.fn() };
    const surface = { className: '', append: vi.fn(), remove: vi.fn() } as unknown as HTMLElement;
    const document = {
      querySelectorAll: vi.fn(() => [staleSurface]),
      createElement: vi.fn(() => surface),
      body: { append: vi.fn() },
    } as unknown as Document;
    const page = { cloneNode: vi.fn(() => ({} as Node)) } as unknown as HTMLElement;

    mountIePrintSurface97(page, document);

    expect(document.querySelectorAll).toHaveBeenCalledWith('.weru97-ie-print-surface');
    expect(staleSurface.remove).toHaveBeenCalledOnce();
  });
});
