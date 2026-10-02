import { describe, expect, it } from 'vitest';
import type { VfsNode } from '../features/filesystem/filesystem-types';
import { VIRTUAL_NODE_IDS } from '../features/filesystem/virtual-paths';
import { getExplorerDetails97, getExplorerInitialView97 } from './explorer-presentation97';

const node = (overrides: Partial<VfsNode>): VfsNode => ({
  id: 'file-readme',
  parentId: VIRTUAL_NODE_IDS.projects,
  name: 'README.md',
  kind: 'file',
  mimeType: 'text/markdown',
  size: 2560,
  createdAt: '2026-09-29T09:00:00.000Z',
  updatedAt: '2026-09-29T09:30:00.000Z',
  ...overrides,
});

describe('Explorer source presentation', () => {
  it('opens Projects and its project subfolders in Details view by default', () => {
    expect(getExplorerInitialView97(VIRTUAL_NODE_IDS.projects)).toBe('details');
    expect(getExplorerInitialView97('project-adventures')).toBe('details');
    expect(getExplorerInitialView97('project-afyatrack')).toBe('details');
    expect(getExplorerInitialView97(VIRTUAL_NODE_IDS.root)).toBe('icons');
    expect(getExplorerInitialView97('folder-my-documents')).toBe('icons');
    expect(getExplorerInitialView97(undefined)).toBe('icons');
  });

  it('orders metadata for the source Size, Type, and Date Modified columns', () => {
    expect(getExplorerDetails97(node({}))).toEqual({
      size: '2.5 KB',
      type: 'Markdown Document',
      modified: expect.stringMatching(/^\d{2}\/\d{2}\/\d{2} \d{1,2}:\d{2} (AM|PM)$/),
    });
  });

  it('labels folders as folders without inventing a file size', () => {
    expect(getExplorerDetails97(node({ kind: 'folder', mimeType: 'inode/directory' }))).toMatchObject({
      size: '',
      type: 'File Folder',
    });
  });
});
