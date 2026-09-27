import { describe, expect, it, vi } from 'vitest';
import type { VfsNode } from '../../features/filesystem/filesystem-types';
import { parseRunCommand97, resolveRunFileTarget97 } from './run-command97';

const node = (overrides: Partial<VfsNode> = {}): VfsNode => ({
  id: 'file-resume', parentId: 'folder-documents', name: 'Resume.txt', kind: 'file',
  mimeType: 'text/plain', content: 'resume', size: 6,
  createdAt: '2026-09-24T00:00:00.000Z', updatedAt: '2026-09-24T00:00:00.000Z',
  ...overrides,
});

describe('Weru Run command parsing and routing', () => {
  it('maps classic program aliases to installed Weru applications', () => {
    expect(parseRunCommand97('calc')).toEqual({ kind: 'application', appId: 'calculator' });
    expect(parseRunCommand97('Windows Media Player')).toEqual({ kind: 'application', appId: 'media-player' });
    expect(parseRunCommand97('Outlook Express')).toEqual({ kind: 'application', appId: 'mail' });
  });

  it('accepts quoted Windows paths and canonicalizes them for the virtual filesystem', () => {
    expect(parseRunCommand97('"c:/my documents/Resume.txt"')).toEqual({
      kind: 'virtual-path', path: 'C:\\My Documents\\Resume.txt',
    });
    expect(parseRunCommand97('Projects\\Kontent-Pyper')).toEqual({
      kind: 'virtual-path', path: 'C:\\Projects\\Kontent-Pyper',
    });
  });

  it('opens explicit or bare web addresses through the safe external route', () => {
    expect(parseRunCommand97('https://github.com/Royweru')).toEqual({ kind: 'external', url: 'https://github.com/Royweru' });
    expect(parseRunCommand97('github.com/Royweru')).toEqual({ kind: 'external', url: 'https://github.com/Royweru' });
  });

  it('blocks system-modifying and non-web schemes', () => {
    expect(parseRunCommand97('format c:')).toMatchObject({ kind: 'error', message: expect.stringContaining('Access denied') });
    expect(parseRunCommand97('regedit')).toMatchObject({ kind: 'error', message: expect.stringContaining('Access denied') });
    expect(parseRunCommand97('javascript:alert(1)')).toMatchObject({ kind: 'error' });
    expect(parseRunCommand97('file:///C:/secret.txt')).toMatchObject({ kind: 'error' });
  });

  it('routes an exact filename through the central file target mapping', async () => {
    const resume = node();
    const result = await resolveRunFileTarget97({ kind: 'lookup', query: 'resume.TXT' }, {
      getByPath: vi.fn(),
      searchByName: vi.fn().mockResolvedValue([resume]),
    });

    expect(result).toEqual({ target: { kind: 'file', nodeId: 'file-resume', title: 'Resume.txt', preferredAppId: 'notepad' } });
  });

  it('uses full paths for duplicate names and reports missing files clearly', async () => {
    const lookups = { getByPath: vi.fn(), searchByName: vi.fn().mockResolvedValue([node(), node({ id: 'file-resume-2', parentId: 'project-1' })]) };
    await expect(resolveRunFileTarget97({ kind: 'lookup', query: 'Resume.txt' }, lookups)).resolves.toMatchObject({ error: expect.stringContaining('full C: path') });
    await expect(resolveRunFileTarget97({ kind: 'virtual-path', path: 'C:\\Unknown.txt' }, { ...lookups, getByPath: vi.fn().mockResolvedValue(undefined) })).resolves.toMatchObject({ error: expect.stringContaining('cannot find') });
  });
});
