import { describe, expect, it } from 'vitest';
import { resolveMarkdownTextLink97 } from './markdown-link97';
import type { VfsNode } from './filesystem-types';

const file = (id: string, parentId: string | null, name: string, extras: Partial<VfsNode> = {}): VfsNode => ({
  id,
  parentId,
  name,
  kind: 'file',
  mimeType: name.toLowerCase().endsWith('.md') ? 'text/markdown' : 'text/plain',
  size: 0,
  createdAt: '',
  updatedAt: '',
  ...extras,
});

describe('Markdown local text-link resolver', () => {
  it('resolves a relative sibling by its VFS name', () => {
    const source = file('readme', 'project', 'README.md');
    const notes = file('notes', 'project', 'Notes.txt');

    expect(resolveMarkdownTextLink97(source, './notes.txt#intro', [source, notes])).toBe(notes);
  });

  it('resolves a nested VFS document and a linked public text asset', () => {
    const source = file('readme', 'project', 'README.md', { contentUrl: '/text/project-readme.md' });
    const folder: VfsNode = { ...file('docs', 'project', 'docs'), kind: 'folder', mimeType: 'inode/directory' };
    const nested = file('guide', 'docs', 'guide.md');
    const publicDoc = file('policy', 'root', 'policy.md', { contentUrl: '/text/policy.md' });
    const nodes = [source, folder, nested, publicDoc];

    expect(resolveMarkdownTextLink97(source, 'docs/guide.md', nodes)).toBe(nested);
    expect(resolveMarkdownTextLink97(source, '/text/policy.md', nodes)).toBe(publicDoc);
  });

  it('rejects external, unsafe, escaping, and non-text links', () => {
    const source = file('readme', 'project', 'README.md', { contentUrl: '/text/project-readme.md' });
    const image = file('image', 'project', 'diagram.png', { mimeType: 'image/png' });
    const nodes = [source, image];

    for (const href of ['https://example.com/notes.md', '//example.com/notes.md', 'javascript:alert(1)', '../other.md', 'diagram.png', 'missing.md']) {
      expect(resolveMarkdownTextLink97(source, href, nodes)).toBeUndefined();
    }
  });
});
