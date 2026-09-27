import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fixtures = vi.hoisted(() => ({ node: null as Record<string, unknown> | null }));

vi.mock('dexie-react-hooks', () => ({ useLiveQuery: () => fixtures.node }));
vi.mock('../features/filesystem/filesystem-service', () => ({
  cacheTextAssetContent: async () => undefined,
  createTextFileNode: async () => undefined,
  getMarkdownLinkedTextFile: async () => undefined,
  getNode: async () => undefined,
  resolveShortcut: async () => undefined,
  updateTextFile: async () => undefined,
}));

import NotepadContent from './NotepadContent';

const markdownSource = '# Project README\n\n[Live demo](https://example.com/demo)';

function makeNode(overrides: Record<string, unknown> = {}) {
  return {
    id: 'project-readme',
    parentId: 'project-folder',
    name: 'README.md',
    kind: 'file',
    mimeType: 'text/markdown',
    content: markdownSource,
    size: markdownSource.length,
    createdAt: '2026-09-24T00:00:00.000Z',
    updatedAt: '2026-09-24T00:00:00.000Z',
    ...overrides,
  };
}

describe('NotepadContent initial document view', () => {
  beforeEach(() => {
    fixtures.node = makeNode();
  });

  it('opens Markdown documents as rendered previews with external links in new tabs', () => {
    const html = renderToStaticMarkup(createElement(NotepadContent, { fileId: 'project-readme' }));

    expect(html).toContain('<article class="win97-markdown-preview" aria-label="Markdown preview">');
    expect(html).toContain('<h1>Project README</h1>');
    expect(html).toContain('href="https://example.com/demo" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('>Source</button>');
    expect(html).not.toContain('<textarea');
  });

  it('keeps plain text documents in the editable Notepad surface', () => {
    fixtures.node = makeNode({
      name: 'notes.txt',
      mimeType: 'text/plain',
      content: 'Plain text stays plain.',
    });

    const html = renderToStaticMarkup(createElement(NotepadContent, { fileId: 'project-readme' }));

    expect(html).toContain('<textarea');
    expect(html).toContain('Plain text stays plain.');
    expect(html).not.toContain('aria-label="Markdown preview"');
  });

  it('renders source-fidelity File, Edit, Search, and Help menus as real menu buttons', () => {
    const html = renderToStaticMarkup(createElement(NotepadContent, { fileId: 'project-readme' }));
    expect(html).toContain('role="menubar" aria-label="Notepad menus"');
    expect(html.match(/aria-haspopup="menu"/g)).toHaveLength(4);
    for (const label of ['File', 'Edit', 'Search', 'Help']) {
      expect(html).toContain(`<span class="underline">${label[0]}</span>${label.slice(1)}`);
    }
  });
});
