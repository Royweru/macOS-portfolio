import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { VfsNode } from '../../features/filesystem/filesystem-types';
import FindFiles97 from './FindFiles97';
import { findFiles97 } from './find-files97';

const file: VfsNode = {
  id: 'file-resume', parentId: 'folder-documents', name: 'Resume.txt', kind: 'file',
  mimeType: 'text/plain', content: 'resume', size: 6,
  createdAt: '2026-09-24T00:00:00.000Z', updatedAt: '2026-09-24T00:00:00.000Z',
};

describe('Find Files dialog', () => {
  it('trims the search term before querying and skips blank searches', async () => {
    const search = vi.fn().mockResolvedValue([file]);
    await expect(findFiles97('  Resume.txt  ', search)).resolves.toEqual([file]);
    expect(search).toHaveBeenCalledWith('Resume.txt');
    await expect(findFiles97('   ', search)).resolves.toEqual([]);
    expect(search).toHaveBeenCalledTimes(1);
  });

  it('provides a keyboard-accessible result workflow and keeps Open disabled before selection', () => {
    const html = renderToStaticMarkup(createElement(FindFiles97, {
      onOpenTarget: () => undefined,
      onClose: () => undefined,
    }));

    expect(html).toContain('aria-label="Find results"');
    expect(html).toContain('Find Now');
    expect(html).toContain('disabled=""');
    expect(html).toContain('>Open</button>');
    expect(html).toContain('>New Search</button>');
  });
});
