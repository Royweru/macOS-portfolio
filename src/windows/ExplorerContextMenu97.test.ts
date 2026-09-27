import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import ExplorerContextMenu97 from './ExplorerContextMenu97';

const callbacks = () => ({
  onOpenNode: vi.fn(),
  onCopy: vi.fn(),
  onCut: vi.fn(),
  onRename: vi.fn(),
  onDelete: vi.fn(),
  onNewFolder: vi.fn(),
  onNewFile: vi.fn(),
  onPaste: vi.fn(),
  onRefresh: vi.fn(),
});

describe('ExplorerContextMenu97 classic menu', () => {
  it('renders file actions using only the scoped Win97 menu surface', () => {
    const html = renderToStaticMarkup(createElement(ExplorerContextMenu97, {
      x: 80,
      y: 120,
      node: { id: 'resume', parentId: 'folder-my-documents', name: 'Resume.txt', kind: 'file', mimeType: 'text/plain', size: 0, createdAt: '', updatedAt: '' },
      clipboardAvailable: true,
      ...callbacks(),
    }));

    expect(html).toContain('class="win97-explorer-context-menu"');
    expect(html).toContain('aria-label="Resume.txt context menu"');
    expect(html).toContain('>Open</button>');
    expect(html).toContain('>Cut</button>');
    expect(html).toContain('>Copy</button>');
    expect(html).toContain('>Rename</button>');
    expect(html).toContain('>Delete</button>');
    expect(html).not.toMatch(/(?:rounded-|shadow-lg|bg-slate-|border-slate-)/);
  });

  it('keeps the folder menu classic and disables Paste without a clipboard item', () => {
    const html = renderToStaticMarkup(createElement(ExplorerContextMenu97, {
      x: 12,
      y: 24,
      clipboardAvailable: false,
      ...callbacks(),
    }));

    expect(html).toContain('aria-label="Folder context menu"');
    expect(html).toContain('>New Folder</button>');
    expect(html).toContain('>New Text Document</button>');
    expect(html).toContain('role="menuitem" disabled="">Paste</button>');
    expect(html).toContain('>Refresh</button>');
    expect(html).not.toMatch(/(?:rounded-|shadow-lg|bg-slate-|border-slate-)/);
  });
});
