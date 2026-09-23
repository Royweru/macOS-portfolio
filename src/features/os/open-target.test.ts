import { describe, expect, it } from 'vitest';
import { isAllowedExternalUrl, targetForNode } from './open-target';

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
});
