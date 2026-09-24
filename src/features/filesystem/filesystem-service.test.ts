import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createPersonalMediaNodes, createProjectMediaNodes, createWin97Nodes, planLegacyMediaLibraryFolderRepair, planLegacyMusicLibraryRepair } from './filesystem-service';
import type { VfsNode } from './filesystem-types';
import { VIRTUAL_NODE_IDS, VIRTUAL_PATHS } from './virtual-paths';
import { createPersonalMediaEntries } from '../../data/personal-media-manifest';
import { DOCUMENTS, PROJECTS } from '../../data/portfolio-manifest';

describe('Weru 97 seeded filesystem topology', () => {
  const nodes = createWin97Nodes();
  const byId = new Map(nodes.map(node => [node.id, node]));

  it('keeps portfolio documents in My Documents and media libraries separate', () => {
    expect(byId.get(VIRTUAL_NODE_IDS.myDocuments)).toMatchObject({ parentId: VIRTUAL_NODE_IDS.root, name: 'My Documents' });
    expect(byId.get(VIRTUAL_NODE_IDS.videos)).toMatchObject({ parentId: VIRTUAL_NODE_IDS.root, name: 'Videos' });
    expect(byId.get(VIRTUAL_NODE_IDS.pictures)).toMatchObject({ parentId: VIRTUAL_NODE_IDS.root, name: 'Pictures' });
    expect(byId.get(VIRTUAL_NODE_IDS.music)).toMatchObject({ parentId: VIRTUAL_NODE_IDS.root, name: 'Music' });
    expect(byId.get(VIRTUAL_NODE_IDS.windowsMedia)).toMatchObject({ parentId: VIRTUAL_NODE_IDS.windows, name: 'Media', isSystem: true });
    expect(byId.get('folder-images')).toMatchObject({
      parentId: VIRTUAL_NODE_IDS.pictures,
      name: 'Screenshots',
      isSystem: true,
      isReadOnly: true,
    });
    expect(byId.get('file-simulation-icons')).toMatchObject({
      parentId: 'folder-images',
      name: 'windows_97_simulation_icons.jpg',
      appId: 'paint',
      isSystem: true,
      isReadOnly: true,
    });

    const documentChildren = nodes.filter(node => node.parentId === VIRTUAL_NODE_IDS.myDocuments);
    expect(documentChildren.map(node => node.name).sort()).toEqual([
      'Resume.txt', 'about_me.txt', 'experience.txt', 'skills.txt',
    ]);
  });

  it('keeps desktop media shortcuts pointed at the same canonical library locations', () => {
    expect(VIRTUAL_PATHS.videos).toBe('C:\\Videos');
    expect(VIRTUAL_PATHS.pictures).toBe('C:\\Pictures');
    expect(VIRTUAL_PATHS.music).toBe('C:\\Music');
    expect(byId.get('desktop-lnk-videos')).toMatchObject({
      parentId: VIRTUAL_NODE_IDS.desktop,
      shortcutTargetId: VIRTUAL_NODE_IDS.videos,
      shortcutTargetPath: VIRTUAL_PATHS.videos,
    });
    expect(byId.get(VIRTUAL_NODE_IDS.desktopPicturesShortcut)).toMatchObject({
      parentId: VIRTUAL_NODE_IDS.desktop,
      shortcutTargetId: VIRTUAL_NODE_IDS.pictures,
      shortcutTargetPath: VIRTUAL_PATHS.pictures,
    });
    expect(byId.get('desktop-lnk-music')).toMatchObject({
      parentId: VIRTUAL_NODE_IDS.desktop,
      shortcutTargetId: VIRTUAL_NODE_IDS.music,
      shortcutTargetPath: VIRTUAL_PATHS.music,
    });
    expect(byId.get(VIRTUAL_NODE_IDS.desktopOutlookShortcut)).toMatchObject({
      parentId: VIRTUAL_NODE_IDS.desktop,
      name: 'Outlook Express.lnk',
      appId: 'mail',
      kind: 'shortcut',
      isSystem: true,
      isReadOnly: true,
    });
  });

  it('seeds validated personal media into its own root library and application route', () => {
    const entries = createPersonalMediaEntries(
      [{ filename: 'Intro_Weru_OS.mp4', title: 'Weru OS intro', src: '/media/videos/Intro_Weru_OS.mp4', durationSeconds: 24 }],
      [{ filename: 'Roy_Weru.bmp', title: 'Roy Weru', src: '/media/pictures/Roy_Weru.bmp' }],
      [{ filename: 'Track01_DaftPunk.mp3', title: 'Track 01', artist: 'Daft Punk', src: '/media/music/Track01_DaftPunk.mp3' }],
    );
    const mediaNodes = createPersonalMediaNodes(entries);

    expect(mediaNodes).toHaveLength(3);
    expect(mediaNodes.map(({ name, parentId, appId }) => ({ name, parentId, appId }))).toEqual([
      { name: 'Intro_Weru_OS.mp4', parentId: VIRTUAL_NODE_IDS.videos, appId: 'media-player' },
      { name: 'Roy_Weru.bmp', parentId: VIRTUAL_NODE_IDS.pictures, appId: 'paint' },
      { name: 'Track01_DaftPunk.mp3', parentId: VIRTUAL_NODE_IDS.music, appId: 'cd-player' },
    ]);
    expect(mediaNodes[0].media).toMatchObject({ kind: 'video', source: '/media/videos/Intro_Weru_OS.mp4', durationSeconds: 24 });
    expect(mediaNodes[1].media).toMatchObject({ kind: 'image', source: '/media/pictures/Roy_Weru.bmp' });
    expect(mediaNodes[2].media).toMatchObject({ kind: 'audio', source: '/media/music/Track01_DaftPunk.mp3', description: 'Daft Punk' });
    expect(createPersonalMediaNodes([{ ...entries[0], asset: { ...entries[0].asset, source: 'https://example.com/not-bundled.mp4' } }])).toEqual([]);
  });

  it('keeps project manifest media inside the matching project folder', () => {
    const projectNodes = createProjectMediaNodes([{
      projectId: 1,
      assets: [{ id: 'afya-demo-extra', projectId: 1, kind: 'video', title: 'AfyaTrack extra demo', source: '/media/videos/afya-extra.mp4', mimeType: 'video/mp4' }],
    }]);

    expect(projectNodes).toHaveLength(1);
    expect(projectNodes[0]).toMatchObject({
      id: 'media-afya-demo-extra',
      parentId: 'project-afyatrack',
      name: 'afya-extra.mp4',
      appId: 'media-player',
    });
    expect(projectNodes[0].parentId).not.toBe(VIRTUAL_NODE_IDS.videos);
  });

  it('points seeded project demos at the bundled public video files', () => {
    expect(byId.get('project-gigaclaw-agent-demo')).toMatchObject({
      parentId: 'project-gigaclaw-agent',
      name: 'demo.avi',
      mimeType: 'video/mp4',
      appId: 'media-player',
      media: { kind: 'video', source: '/media/videos/gigaclaw.mp4', projectId: 3 },
    });
    expect(byId.get('project-afyatrack-demo')?.media?.source).toBe('/media/videos/afya_track.mp4');
  });

  it('seeds project README links as read-only Markdown assets, not as literal path text', () => {
    const projectsWithReadmes = PROJECTS.filter(project => project.readme);
    expect(projectsWithReadmes.length).toBeGreaterThan(0);
    for (const project of projectsWithReadmes) {
      expect(project.readme).toMatch(/^\/(?!\/).+\.md$/i);
      expect(existsSync(join(process.cwd(), 'public', project.readme!.slice(1)))).toBe(true);
      const readme = byId.get(`project-${project.id}-readme`);
      expect(readme).toMatchObject({
        parentId: `project-${project.id}`,
        name: 'README.md',
        mimeType: 'text/markdown',
        appId: 'notepad',
        contentUrl: project.readme,
        content: '',
        isReadOnly: true,
        isSystem: true,
      });
      expect(readme?.content).not.toBe(project.readme);
    }
  });

  it('seeds personal documents as links to public text assets, not inline manifest text', () => {
    for (const document of DOCUMENTS) {
      expect(document.src).toMatch(/^\/(?!\/).+\.txt$/i);
      expect(existsSync(join(process.cwd(), 'public', document.src.slice(1)))).toBe(true);
      const nodeId = `file-${document.id === 'about' ? 'about-me' : document.id}`;
      expect(byId.get(nodeId)).toMatchObject({
        parentId: VIRTUAL_NODE_IDS.myDocuments,
        name: document.filename,
        mimeType: 'text/plain',
        appId: 'notepad',
        contentUrl: document.src,
        content: '',
        isReadOnly: true,
        isSystem: true,
      });
      expect('content' in document).toBe(false);
    }
  });

  it('moves legacy Videos and Screenshots contents out of My Documents without losing descendants', () => {
    const makeNode = (id: string, parentId: string | null, name: string, kind: VfsNode['kind']): VfsNode => ({
      id, parentId, name, kind,
      mimeType: kind === 'folder' ? 'inode/directory' : 'text/plain',
      size: 0, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    });
    const legacyNodes = [
      makeNode('folder-my-documents', 'root', 'My Documents', 'folder'),
      makeNode('legacy-videos', 'folder-my-documents', 'Videos', 'folder'),
      makeNode('legacy-screenshots', 'folder-my-documents', 'Screenshots', 'folder'),
      makeNode('user-video', 'legacy-videos', 'demo.avi', 'file'),
      makeNode('user-album', 'legacy-screenshots', 'Album', 'folder'),
      makeNode('user-image', 'user-album', 'photo.bmp', 'file'),
    ];

    const repair = planLegacyMediaLibraryFolderRepair(legacyNodes);
    const movedById = new Map(repair.movedNodes.map(node => [node.id, node]));

    expect(repair.emptiedFolderIds).toEqual(['legacy-videos', 'legacy-screenshots']);
    expect(movedById.get('user-video')?.parentId).toBe(VIRTUAL_NODE_IDS.videos);
    expect(movedById.get('user-album')?.parentId).toBe('folder-images');
    expect(movedById.has('user-image')).toBe(false);
    expect(legacyNodes.find(node => node.id === 'user-image')?.parentId).toBe('user-album');
  });

  it('moves only personal legacy audio out of Windows Media and preserves system/project data', () => {
    const makeNode = (id: string, parentId: string | null, name: string, kind: VfsNode['kind'], extras: Partial<VfsNode> = {}): VfsNode => ({
      id, parentId, name, kind,
      mimeType: kind === 'folder' ? 'inode/directory' : 'audio/mpeg',
      size: 0, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
      ...extras,
    });
    const legacyNodes = [
      makeNode(VIRTUAL_NODE_IDS.windowsMedia, VIRTUAL_NODE_IDS.windows, 'Media', 'folder', { isSystem: true }),
      makeNode('old-track', VIRTUAL_NODE_IDS.windowsMedia, 'Track01.mp3', 'file'),
      makeNode('old-album', VIRTUAL_NODE_IDS.windowsMedia, 'Personal Album', 'folder'),
      makeNode('old-album-track', 'old-album', 'Track02.wav', 'file'),
      makeNode('system-sound', VIRTUAL_NODE_IDS.windowsMedia, 'startup.wav', 'file', { isSystem: true }),
      makeNode('media-project-demo', VIRTUAL_NODE_IDS.windowsMedia, 'project-demo.mp4', 'file', { mimeType: 'video/mp4' }),
      makeNode('old-readme', VIRTUAL_NODE_IDS.windowsMedia, 'notes.txt', 'file', { mimeType: 'text/plain' }),
    ];

    const repair = planLegacyMusicLibraryRepair(legacyNodes, new Set(['media-project-demo']));
    const movedById = new Map(repair.movedNodes.map(node => [node.id, node]));

    expect(repair.movedRootIds).toEqual(['old-track', 'old-album']);
    expect(movedById.get('old-track')?.parentId).toBe(VIRTUAL_NODE_IDS.music);
    expect(movedById.get('old-album')?.parentId).toBe(VIRTUAL_NODE_IDS.music);
    expect(movedById.get('old-album-track')?.parentId).toBe('old-album');
    expect(movedById.has('system-sound')).toBe(false);
    expect(movedById.has('media-project-demo')).toBe(false);
    expect(movedById.has('old-readme')).toBe(false);
  });
});
