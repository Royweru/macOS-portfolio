'use client';

import { DOCUMENTS, PROJECTS } from '../../data/portfolio-manifest';
import projectsData from '../../data/projects_data.json';
import { PORTFOLIO_DOCUMENTS } from '../../data/portfolio-document-manifest';
import { PROJECT_MEDIA_MANIFEST } from '../../data/project-media-manifest';
import { PERSONAL_MEDIA_ENTRIES } from '../../data/personal-media-manifest';
import { filesystemDb, legacyFilesystemDb } from './filesystem-db';
import type { TrashEntry, VfsNode } from './filesystem-types';
import { VIRTUAL_LAYOUT_VERSION, VIRTUAL_NODE_IDS, VIRTUAL_PATHS, normalizeVirtualPath } from './virtual-paths';
import { isBundledMediaSource, isSupportedMediaMimeType } from '../media/media-types';
import { getBrowserProfileId } from '../os/profile-storage';

const ROOT_ID = VIRTUAL_NODE_IDS.root;
const now = () => new Date().toISOString();

const getProfileSnapshot = async () => {
  const nodes = await filesystemDb.nodes.toArray();
  const trash = await filesystemDb.trash.toArray();
  let settings: Record<string, unknown> = {};
  if (typeof window !== 'undefined') {
    try {
      const persisted = JSON.parse(window.localStorage.getItem(`weru-os-state-${getBrowserProfileId()}`) ?? '{}') as { state?: { settings?: Record<string, unknown> } };
      settings = persisted.state?.settings ?? {};
    } catch {
      settings = {};
    }
  }
  return JSON.stringify({
    schemaVersion: 1,
    profileId: getBrowserProfileId(),
    displayName: 'Admin',
    createdAt: await filesystemDb.meta.get('profile-created-at').then(record => record?.value ?? now()),
    lastOpenedAt: now(),
    settings,
    paths: VIRTUAL_PATHS,
    storage: { provider: 'IndexedDB + localStorage', scope: 'browser-local' },
    counts: { nodes: nodes.length, trashEntries: trash.length },
  }, null, 2);
};

const getSettingsSnapshot = () => {
  if (typeof window === 'undefined') return '{}';
  try {
    const persisted = JSON.parse(window.localStorage.getItem(`weru-os-state-${getBrowserProfileId()}`) ?? '{}') as { state?: { settings?: Record<string, unknown> } };
    return JSON.stringify({ schemaVersion: 1, settings: persisted.state?.settings ?? {} }, null, 2);
  } catch {
    return JSON.stringify({ schemaVersion: 1, settings: {} }, null, 2);
  }
};

const withDynamicContent = async (node: VfsNode) => {
  if (node.id !== VIRTUAL_NODE_IDS.profileJson && node.id !== VIRTUAL_NODE_IDS.settingsJson) return node;
  const content = node.id === VIRTUAL_NODE_IDS.profileJson ? await getProfileSnapshot() : getSettingsSnapshot();
  return { ...node, content, size: content.length, updatedAt: now() };
};

const createFolder = (id: string, parentId: string | null, name: string, isHidden = false): VfsNode => ({
  id,
  parentId,
  name,
  kind: 'folder',
  mimeType: 'inode/directory',
  size: 0,
  createdAt: now(),
  updatedAt: now(),
  isHidden,
});

const createFile = (
  id: string,
  parentId: string,
  name: string,
  content: string,
  mimeType = 'text/plain',
  appId = 'notepad',
): VfsNode => ({
  id,
  parentId,
  name,
  kind: 'file',
  mimeType,
  appId,
  content,
  size: content.length,
  createdAt: now(),
  updatedAt: now(),
});

const createShortcut = (id: string, parentId: string, name: string, targetId?: string, targetPath?: string, appId = 'explorer'): VfsNode => ({
  ...createFile(id, parentId, name, '', 'application/x-ms-shortcut', appId),
  kind: 'shortcut',
  shortcutTargetId: targetId,
  shortcutTargetPath: targetPath,
});

const createDesktopShortcut = (...args: Parameters<typeof createShortcut>): VfsNode => ({
  ...createShortcut(...args),
  isSystem: true,
  isReadOnly: true,
});

const mediaParent = (kind: 'video' | 'audio' | 'image') => kind === 'video'
  ? VIRTUAL_NODE_IDS.videos
  : kind === 'audio' ? VIRTUAL_NODE_IDS.music : VIRTUAL_NODE_IDS.pictures;

const mediaApp = (kind: 'video' | 'audio' | 'image') => kind === 'video'
  ? 'media-player'
  : kind === 'audio' ? 'cd-player' : 'paint';

const filenameFromSource = (source: string, fallback: string) => {
  const encoded = source.split(/[?#]/, 1)[0].split('/').filter(Boolean).at(-1) ?? fallback;
  try { return decodeURIComponent(encoded); } catch { return encoded; }
};

export const createPersonalMediaNodes = (entries = PERSONAL_MEDIA_ENTRIES): VfsNode[] => entries
  .filter(entry => isBundledMediaSource(entry.asset) && isSupportedMediaMimeType(entry.kind, entry.mimeType))
  .map(entry => ({
    ...createFile(entry.id, mediaParent(entry.kind), entry.filename, '', entry.mimeType, mediaApp(entry.kind)),
    media: {
      mediaId: entry.asset.id,
      projectId: 0,
      kind: entry.kind,
      source: entry.asset.source,
      poster: entry.asset.poster,
      title: entry.asset.title,
      description: entry.asset.description,
      durationSeconds: entry.asset.durationSeconds,
    },
  }));

const projectFolderForManifest = (projectId: number) => {
  const dataProject = projectsData.find(item => Number(item.id) === projectId);
  const project = dataProject
    ? PROJECTS.find(item => item.title.trim().toLowerCase() === dataProject.title.trim().toLowerCase())
    : PROJECTS.find(item => item.legacyId === projectId || Number(item.id) === projectId);
  if (project) return { id: `project-${project.id}`, title: project.folderName };
  return dataProject ? { id: `project-${dataProject.id}`, title: dataProject.title } : undefined;
};

export const createProjectMediaNodes = (manifests = PROJECT_MEDIA_MANIFEST): VfsNode[] => manifests.flatMap(manifest => {
  const folder = projectFolderForManifest(manifest.projectId);
  if (!folder) return [];
  const project = PROJECTS.find(item => `project-${item.id}` === folder.id);
  const inlineSources = new Set([
    project?.files?.demo?.src,
    ...(project?.files?.screenshots ?? []),
    project?.files?.audio?.src,
  ].filter((source): source is string => Boolean(source)));
  return manifest.assets
    .filter(asset => !inlineSources.has(asset.source)
      && isBundledMediaSource(asset)
      && isSupportedMediaMimeType(asset.kind, asset.mimeType))
    .map(asset => {
      const filename = filenameFromSource(asset.source, asset.id);
      return {
        ...createFile(`media-${asset.id}`, folder.id, filename, '', asset.mimeType, mediaApp(asset.kind)),
        media: {
          mediaId: asset.id,
          projectId: asset.projectId,
          kind: asset.kind,
          source: asset.source,
          poster: asset.poster,
          title: asset.title,
          description: asset.description,
          durationSeconds: asset.durationSeconds,
          captionSource: asset.captionSource,
        },
      };
  });
});

const createProjectDemoNodes = (): VfsNode[] => PROJECTS.flatMap(project => {
  const demo = project.files?.demo;
  if (!demo) return [];
  const projectId = `project-${project.id}`;
  return [{
    ...createFile(`${projectId}-demo`, projectId, 'demo.avi', '', demo.mimeType ?? 'video/mp4', 'media-player'),
    media: {
      mediaId: `${project.id}-demo`,
      projectId: project.legacyId ?? 0,
      kind: 'video',
      source: demo.src,
      poster: demo.poster,
      title: demo.title ?? `${project.title} Demo`,
      durationSeconds: demo.durationSeconds,
    },
  }];
});

// Synchronize inline project demos on every filesystem startup too, so a
// corrected public asset URL reaches already-seeded IndexedDB nodes safely.
const createMediaNodes = () => [...createPersonalMediaNodes(), ...createProjectMediaNodes(), ...createProjectDemoNodes()];

const syncMediaNodes = async () => {
  const nodes = createMediaNodes();
  if (!nodes.length && !PROJECT_MEDIA_MANIFEST.length) return;
  await filesystemDb.transaction('rw', filesystemDb.nodes, async () => {
    for (const node of nodes) {
      const existing = await filesystemDb.nodes.get(node.id);
      await filesystemDb.nodes.put(existing ? {
        ...node,
        name: existing.name,
        content: existing.content,
        size: existing.size,
        createdAt: existing.createdAt,
        isSystem: existing.isSystem,
        isReadOnly: existing.isReadOnly,
      } : node);
    }

    for (const manifest of PROJECT_MEDIA_MANIFEST) {
      for (const asset of manifest.assets) {
        const oldShortcut = await filesystemDb.nodes.get(`shortcut-${asset.id}`);
        if (oldShortcut?.kind === 'shortcut' && oldShortcut.appId === 'media-player' && oldShortcut.shortcutTargetId === `media-${asset.id}`) {
          await filesystemDb.nodes.delete(oldShortcut.id);
        }
      }
    }
  });
};

export const createWin97Nodes = () => {
  const desktopId = VIRTUAL_NODE_IDS.desktop;
  const myDocumentsId = VIRTUAL_NODE_IDS.myDocuments;
  const projectsId = VIRTUAL_NODE_IDS.projects;
  const programFilesId = VIRTUAL_NODE_IDS.programFiles;
  const windowsId = VIRTUAL_NODE_IDS.windows;
  const windowsMediaId = VIRTUAL_NODE_IDS.windowsMedia;
  const windowsSystemId = VIRTUAL_NODE_IDS.windowsSystem;
  const recycledId = VIRTUAL_NODE_IDS.recycled;
  const startMenuId = VIRTUAL_NODE_IDS.startMenu;
  const videosId = VIRTUAL_NODE_IDS.videos;
  const picturesId = VIRTUAL_NODE_IDS.pictures;
  const musicId = VIRTUAL_NODE_IDS.music;
  const accessoriesId = 'folder-accessories';
  const gamesId = 'folder-games';
  const nodes: VfsNode[] = [
    createFolder(ROOT_ID, null, 'C:'),
    createFolder(desktopId, ROOT_ID, 'Desktop'),
    createFolder(myDocumentsId, ROOT_ID, 'My Documents'),
    createFolder(videosId, ROOT_ID, 'Videos'),
    createFolder(picturesId, ROOT_ID, 'Pictures'),
    createFolder(musicId, ROOT_ID, 'Music'),
    createFolder(projectsId, ROOT_ID, 'Projects'),
    createFolder(programFilesId, ROOT_ID, 'Program Files'),
    createFolder(windowsId, ROOT_ID, 'Windows'),
    { ...createFolder(windowsMediaId, windowsId, 'Media'), isSystem: true },
    { ...createFolder(windowsSystemId, windowsId, 'System'), isSystem: true },
    { ...createFolder(recycledId, ROOT_ID, 'Recycled'), isSystem: true },
    { ...createFolder(startMenuId, windowsId, 'Start Menu'), isSystem: true },
    { ...createFolder('folder-images', picturesId, 'Screenshots'), isSystem: true, isReadOnly: true },
    createFolder(accessoriesId, programFilesId, 'Accessories'),
    createFolder(gamesId, programFilesId, 'Games'),
    // Desktop Shortcuts
    createDesktopShortcut('desktop-lnk-projects', desktopId, 'Projects.lnk', projectsId, VIRTUAL_PATHS.projects, 'explorer'),
    createDesktopShortcut('desktop-lnk-my-documents', desktopId, 'My Documents.lnk', myDocumentsId, VIRTUAL_PATHS.myDocuments, 'explorer'),
    createDesktopShortcut('desktop-lnk-videos', desktopId, 'Videos.lnk', videosId, VIRTUAL_PATHS.videos, 'explorer'),
    createDesktopShortcut(VIRTUAL_NODE_IDS.desktopPicturesShortcut, desktopId, 'My Pictures.lnk', picturesId, VIRTUAL_PATHS.pictures, 'explorer'),
    createDesktopShortcut('desktop-lnk-music', desktopId, 'My Music.lnk', musicId, VIRTUAL_PATHS.music, 'explorer'),
    createDesktopShortcut(VIRTUAL_NODE_IDS.desktopOutlookShortcut, desktopId, 'Outlook Express.lnk', undefined, undefined, 'mail'),
    { ...createFile('root-io-sys', ROOT_ID, 'IO.SYS', '', 'application/octet-stream', 'msdos'), isHidden: true, isSystem: true, isReadOnly: true },
    { ...createFile('root-msdos-sys', ROOT_ID, 'MSDOS.SYS', '', 'application/octet-stream', 'msdos'), isHidden: true, isSystem: true, isReadOnly: true },
    { ...createFile('root-command-com', ROOT_ID, 'COMMAND.COM', 'Weru 97 command processor', 'application/octet-stream', 'msdos'), isHidden: true, isSystem: true, isReadOnly: true },
    { ...createFile('file-secrets', windowsSystemId, 'secrets.txt', 'You found the quiet corner of Weru 97.\n\nTry `matrix` in MS-DOS Prompt.', 'text/plain', 'notepad'), isSystem: true, isReadOnly: true },
    { ...createFile(VIRTUAL_NODE_IDS.settingsJson, windowsSystemId, 'Settings.json', '{}', 'application/json', 'control-panel'), isSystem: true, isReadOnly: true },
    { ...createFile(VIRTUAL_NODE_IDS.profileJson, ROOT_ID, 'Weru Profile.json', '', 'application/json', 'system-properties'), isSystem: true, isReadOnly: true },
    {
      ...createFile('file-simulation-icons', 'folder-images', 'windows_97_simulation_icons.jpg', '', 'image/jpeg', 'paint'),
      isSystem: true,
      isReadOnly: true,
      media: {
        mediaId: 'windows-97-simulation-icons',
        projectId: 0,
        kind: 'image',
        source: '/assets/win97/reference/windows_97_simulation_icons.jpg',
        title: 'Weru 97 simulation icons',
        description: 'User-supplied icon and cursor reference sheet for Weru 97 visual QA.',
      },
    },
  ];

  const documentNodeIds: Record<string, string> = { about: 'file-about-me', skills: 'file-skills', experience: 'file-experience', resume: 'file-resume' };
  nodes.push(...DOCUMENTS.map((document) => ({
    ...createFile(documentNodeIds[document.id] ?? `file-${document.id}`, myDocumentsId, document.filename, '', 'text/plain', 'notepad'),
    contentUrl: document.src,
    isSystem: document.readOnly,
    isReadOnly: document.readOnly,
  })));

  for (const project of PROJECTS) {
    const projectId = `project-${project.id}`;
    nodes.push(createFolder(projectId, projectsId, project.folderName));

    if (project.readme) {
      nodes.push({
        ...createFile(`${projectId}-readme`, projectId, 'README.md', '', 'text/markdown', 'notepad'),
        contentUrl: project.readme,
        isSystem: true,
        isReadOnly: true,
      });
    }

    if (project.skillsUsed && project.skillsUsed.length > 0) {
      nodes.push(createFile(`${projectId}-skills`, projectId, 'skills-used.txt', project.skillsUsed.join('\n'), 'text/plain', 'notepad'));
    }

    if (project.techStack) {
      const techLines = [
        project.techStack.language ? `Language: ${project.techStack.language}` : '',
        project.techStack.framework ? `Framework: ${project.techStack.framework}` : '',
        project.techStack.database ? `Database: ${project.techStack.database}` : '',
        project.techStack.hosting ? `Hosting: ${project.techStack.hosting}` : '',
        project.techStack.other?.length ? `Other: ${project.techStack.other.join(', ')}` : '',
      ].filter(Boolean).join('\n');
      nodes.push(createFile(`${projectId}-tech`, projectId, 'tech-stack.spec', techLines, 'text/plain', 'system-properties'));
    }

    if (project.files?.screenshots && project.files.screenshots.length > 0) {
      nodes.push({
        ...createFile(`${projectId}-screenshots`, projectId, 'screenshots.bmp', '', 'image/png', 'paint'),
        media: {
          mediaId: `${project.id}-screenshot-0`,
          projectId: project.legacyId ?? 0,
          kind: 'image',
          source: project.files.screenshots[0],
          title: `${project.title} Screenshot`,
        },
      });
    }

    if (project.files?.audio) {
      nodes.push({
        ...createFile(`${projectId}-audio`, projectId, 'soundtrack.wav', '', 'audio/wav', 'cd-player'),
        media: {
          mediaId: `${project.id}-audio`,
          projectId: project.legacyId ?? 0,
          kind: 'audio',
          source: project.files.audio.src,
          title: project.files.audio.title,
          description: project.files.audio.artist,
          durationSeconds: project.files.audio.duration,
        },
      });
    }

    const sourceUrl = project.files?.sourceCode ?? project.github;
    if (sourceUrl) {
      nodes.push({
        ...createFile(`${projectId}-source`, projectId, 'source-code.url', sourceUrl, 'text/uri-list', 'ie4'),
        isSystem: true,
        isReadOnly: true,
      });
    }

    const liveUrl = project.files?.liveSite ?? project.live;
    if (liveUrl) {
      nodes.push({
        ...createFile(`${projectId}-live`, projectId, 'live-site.url', liveUrl, 'text/uri-list', 'ie4'),
        isSystem: true,
        isReadOnly: true,
      });
    }
  }

  const seededProjectFolders = new Set(nodes.filter(node => node.kind === 'folder').map(node => node.id));
  for (const manifest of PROJECT_MEDIA_MANIFEST) {
    const folder = projectFolderForManifest(manifest.projectId);
    if (folder && !seededProjectFolders.has(folder.id)) {
      nodes.push(createFolder(folder.id, projectsId, folder.title));
      seededProjectFolders.add(folder.id);
    }
  }

  nodes.push(...createMediaNodes());

  const accessories = [
    ['notepad.exe.lnk', 'notepad'], ['calc.exe.lnk', 'calculator'], ['paint.exe.lnk', 'paint'], ['iexplore.exe.lnk', 'ie4'],
  ] as const;
  const games = [['minesweeper.exe.lnk', 'minesweeper']] as const;
  nodes.push(...accessories.map(([name, appId]) => createShortcut(`shortcut-${appId}`, accessoriesId, name, undefined, undefined, appId)));
  nodes.push(...games.map(([name, appId]) => createShortcut(`shortcut-${appId}`, gamesId, name, undefined, undefined, appId)));
  return nodes;
};

/**
 * Plan a lossless repair for old media-library folders left inside My Documents.
 * Only the now-empty duplicate folder records are removed; all descendants are
 * reparented into the canonical library folders, retaining their ids and data.
 */
export const planLegacyMediaLibraryFolderRepair = (existingNodes: VfsNode[]) => {
  const targets = new Map([
    ['videos', VIRTUAL_NODE_IDS.videos],
    ['screenshots', 'folder-images'],
  ]);
  const misplaced = existingNodes.filter(node => node.kind === 'folder'
    && node.parentId === VIRTUAL_NODE_IDS.myDocuments
    && targets.has(node.name.trim().toLowerCase())
    && node.id !== targets.get(node.name.trim().toLowerCase()));
  const targetByFolderId = new Map(misplaced.map(folder => [
    folder.id,
    targets.get(folder.name.trim().toLowerCase())!,
  ]));
  const movedNodes = existingNodes
    .filter(node => node.parentId !== null && targetByFolderId.has(node.parentId))
    .map(node => ({
      ...node,
      parentId: targetByFolderId.get(node.parentId!)!,
      updatedAt: now(),
    }));

  return { movedNodes, emptiedFolderIds: misplaced.map(folder => folder.id) };
};

/** Move personal audio that used the old My Music -> Windows\Media alias.
 * System nodes and project-manifest files stay in place for their own migrations.
 */
export const planLegacyMusicLibraryRepair = (
  existingNodes: VfsNode[],
  projectMediaIds = new Set(PROJECT_MEDIA_MANIFEST.flatMap(manifest => manifest.assets.map(asset => `media-${asset.id}`))),
) => {
  const childrenByParent = new Map<string, VfsNode[]>();
  for (const node of existingNodes) {
    if (!node.parentId) continue;
    const children = childrenByParent.get(node.parentId) ?? [];
    children.push(node);
    childrenByParent.set(node.parentId, children);
  }

  const descendantsOfFolder = (root: VfsNode) => {
    const descendants: VfsNode[] = [];
    const pending = [...(childrenByParent.get(root.id) ?? [])];
    while (pending.length) {
      const next = pending.pop()!;
      descendants.push(next);
      pending.push(...(childrenByParent.get(next.id) ?? []));
    }
    return descendants;
  };

  const rootsToMove = existingNodes.filter(node => {
    if (node.parentId !== VIRTUAL_NODE_IDS.windowsMedia || node.isSystem || node.kind === 'shortcut' || projectMediaIds.has(node.id)) return false;
    if (node.kind === 'folder') {
      return descendantsOfFolder(node).every(descendant => !descendant.isSystem && !projectMediaIds.has(descendant.id));
    }
    return node.kind === 'file' && (node.mimeType.toLowerCase().startsWith('audio/') || /\.(mp3|wav|ogg|oga|m4a|mid|midi|webm)$/i.test(node.name));
  });

  const movedIds = new Set(rootsToMove.map(node => node.id));
  for (const root of rootsToMove) {
    for (const descendant of descendantsOfFolder(root)) movedIds.add(descendant.id);
  }
  const movedNodes = existingNodes
    .filter(node => movedIds.has(node.id))
    .map(node => ({ ...node, ...(rootsToMove.some(root => root.id === node.id) ? { parentId: VIRTUAL_NODE_IDS.music } : {}), updatedAt: now() }));

  return { movedNodes, movedRootIds: rootsToMove.map(node => node.id) };
};

async function migrateWin97Layout() {
  const nodes = createWin97Nodes();
  const protectedReferenceNodes = nodes.filter(node => node.id === 'folder-images' || node.id === 'file-simulation-icons');
  await filesystemDb.transaction('rw', filesystemDb.nodes, filesystemDb.meta, async () => {
    const existingNodes = await filesystemDb.nodes.toArray();
    const mediaFolderRepair = planLegacyMediaLibraryFolderRepair(existingNodes);
    const musicFolderRepair = planLegacyMusicLibraryRepair(existingNodes);
    for (const node of mediaFolderRepair.movedNodes) await filesystemDb.nodes.put(node);
    for (const node of musicFolderRepair.movedNodes) await filesystemDb.nodes.put(node);
    for (const folderId of mediaFolderRepair.emptiedFolderIds) await filesystemDb.nodes.delete(folderId);

    for (const node of nodes) {
      const existing = await filesystemDb.nodes.get(node.id);
      if (!existing || node.isSystem || node.kind === 'folder') {
        const nextNode = node.contentUrl && existing?.contentUrl === node.contentUrl && existing.content
          ? { ...node, content: existing.content, size: existing.size, createdAt: existing.createdAt }
          : node;
        await filesystemDb.nodes.put(nextNode);
      }
    }
    // These app-owned assets must remain discoverable even in a profile whose
    // original seed predates the Pictures library. Reconcile only these stable
    // system nodes; never reset or delete user-created folder contents.
    for (const node of protectedReferenceNodes) await filesystemDb.nodes.put(node);
    await filesystemDb.meta.put({ key: 'layout-version', value: String(VIRTUAL_LAYOUT_VERSION) });
  });
  await syncMediaNodes();
};

export const seedFilesystem = async () => {
  const seeded = await filesystemDb.meta.get('seeded');
  if (seeded) {
    await migrateWin97Layout();
    return;
  }
  const nodes = createWin97Nodes();
  await filesystemDb.transaction('rw', filesystemDb.nodes, filesystemDb.meta, async () => {
    await filesystemDb.nodes.bulkPut(nodes);
    const timestamp = now();
    await filesystemDb.meta.bulkPut([
      { key: 'seeded', value: timestamp },
      { key: 'layout-version', value: String(VIRTUAL_LAYOUT_VERSION) },
      { key: 'profile-created-at', value: timestamp },
    ]);
  });
};

const seedLegacyFilesystem = async () => {
  const currentSeeded = await filesystemDb.meta.get('seeded');
  const legacySeeded = await legacyFilesystemDb.meta.get('seeded');
  if (!currentSeeded && legacySeeded) {
    const legacyNodes = await legacyFilesystemDb.nodes.toArray();
    const legacyTrash = await legacyFilesystemDb.trash.toArray();
    const legacyMeta = await legacyFilesystemDb.meta.toArray();
    await filesystemDb.transaction('rw', filesystemDb.nodes, filesystemDb.trash, filesystemDb.meta, async () => {
      await filesystemDb.nodes.bulkPut(legacyNodes);
      await filesystemDb.trash.bulkPut(legacyTrash);
      await filesystemDb.meta.bulkPut(legacyMeta);
      await filesystemDb.meta.put({ key: 'profile-migrated-from-legacy', value: now() });
    });
  }
  const seeded = await filesystemDb.meta.get('seeded');
  if (seeded) {
    await migrateFilesystemLayout();
    return;
  }

  const userId = VIRTUAL_NODE_IDS.profile;
  const desktopId = VIRTUAL_NODE_IDS.desktop;
  const documentsId = VIRTUAL_NODE_IDS.documents;
  const picturesId = VIRTUAL_NODE_IDS.pictures;
  const projectsId = VIRTUAL_NODE_IDS.projects;
  const windowsId = VIRTUAL_NODE_IDS.windows;
  const system32Id = VIRTUAL_NODE_IDS.system32;

  const nodes: VfsNode[] = [
    createFolder(ROOT_ID, null, 'C:'),
    createFolder(VIRTUAL_NODE_IDS.users, ROOT_ID, 'Users'),
    createFolder(userId, VIRTUAL_NODE_IDS.users, 'Admin'),
    createFolder(desktopId, userId, 'Desktop'),
    createFolder(documentsId, userId, 'Documents'),
    createFolder(VIRTUAL_NODE_IDS.downloads, userId, 'Downloads'),
    createFolder(picturesId, userId, 'Pictures'),
    createFolder(projectsId, desktopId, 'Projects'),
    createFolder(VIRTUAL_NODE_IDS.videos, userId, 'Videos'),
    createFolder(VIRTUAL_NODE_IDS.music, userId, 'Music'),
    createFolder(VIRTUAL_NODE_IDS.appData, userId, 'AppData', true),
    createFolder(VIRTUAL_NODE_IDS.localAppData, VIRTUAL_NODE_IDS.appData, 'Local', true),
    createFolder(VIRTUAL_NODE_IDS.weruAppData, VIRTUAL_NODE_IDS.localAppData, 'Weru OS', true),
    {
      ...createFolder(VIRTUAL_NODE_IDS.audioAlias, userId, 'Audio'),
      kind: 'shortcut',
      mimeType: 'application/x-ms-shortcut',
      shortcutTargetId: VIRTUAL_NODE_IDS.music,
      shortcutTargetPath: 'C:\\Users\\Admin\\Music',
    },
    createFolder(windowsId, ROOT_ID, 'Windows'),
    { ...createFolder(system32Id, windowsId, 'System32', true), isSystem: true },
    {
      ...createFile(VIRTUAL_NODE_IDS.profileJson, userId, 'Weru Profile.json', '', 'application/json', 'explorer'),
      isSystem: true,
      isReadOnly: true,
    },
    {
      ...createFile(VIRTUAL_NODE_IDS.settingsJson, VIRTUAL_NODE_IDS.weruAppData, 'Settings.json', '{}', 'application/json', 'settings'),
      isSystem: true,
      isReadOnly: true,
    },
    ...PORTFOLIO_DOCUMENTS.map(document => ({ ...createFile(document.id, desktopId, document.name, '', 'text/plain', 'notepad'), contentUrl: document.contentUrl, isSystem: true, isReadOnly: true })),
    createShortcut(VIRTUAL_NODE_IDS.desktopThisPcShortcut, desktopId, 'This PC.lnk', ROOT_ID, VIRTUAL_PATHS.drive),
    createShortcut(VIRTUAL_NODE_IDS.desktopProjectsShortcut, desktopId, 'Projects.lnk', projectsId, VIRTUAL_PATHS.projects),
    createShortcut(VIRTUAL_NODE_IDS.desktopContactShortcut, desktopId, 'Contact.lnk', undefined, undefined, 'mail'),
    createFile(
      'file-system32-readme',
      system32Id,
      'README.txt',
      'You found the quiet corner of Weru OS.\n\nTry opening Terminal and running: matrix\n',
    ),
  ];

  for (const project of projectsData) {
    const projectId = `project-${project.id}`;
    const readmeId = `${projectId}-readme`;
    nodes.push(
      createFolder(projectId, projectsId, project.title),
      createFile(
        readmeId,
        projectId,
        'README.md',
        `# ${project.title}\n\n${project.description}\n\nTechnology: ${project.tech.join(', ')}`,
        'text/markdown',
      ),
      createFile(`${projectId}-overview`, projectId, 'Project Overview.txt', `${project.title}\n${'='.repeat(project.title.length)}\n\n${project.description}\n\nTechnology: ${project.tech.join(', ')}`, 'text/plain', 'notepad'),
      ...(project.github ? [{ ...createFile(`${projectId}-github`, projectId, 'Repository.url', project.github, 'text/uri-list', 'browser'), isSystem: true, isReadOnly: true }] : []),
      ...(project.live ? [{ ...createFile(`${projectId}-live`, projectId, 'Live Site.url', project.live, 'text/uri-list', 'browser'), isSystem: true, isReadOnly: true }] : []),
    );
  }

  nodes.push(...createMediaNodes());

  await filesystemDb.transaction('rw', filesystemDb.nodes, filesystemDb.meta, async () => {
    await filesystemDb.nodes.bulkPut(nodes);
    await filesystemDb.meta.bulkPut([
      { key: 'seeded', value: now() },
      { key: 'layout-version', value: String(VIRTUAL_LAYOUT_VERSION) },
      { key: 'profile-created-at', value: now() },
    ]);
  });
};

void seedLegacyFilesystem;

const ensureFolder = async (parentId: string, id: string, name: string) => {
  const existing = await filesystemDb.nodes.get(id);
  if (existing) return existing;
  const existingByName = await filesystemDb.nodes
    .where('parentId').equals(parentId)
    .filter(node => node.kind === 'folder' && node.name.toLowerCase() === name.toLowerCase())
    .first();
  if (existingByName) return existingByName;
  const node = createFolder(id, parentId, name);
  await filesystemDb.nodes.put(node);
  return node;
};

async function migrateFilesystemLayout() {
  const layout = await filesystemDb.meta.get('layout-version');
  if (layout?.value === String(VIRTUAL_LAYOUT_VERSION)) {
    await syncMediaNodes();
    return;
  }

  await filesystemDb.transaction('rw', filesystemDb.nodes, filesystemDb.meta, async () => {
    const legacyVisitor = await filesystemDb.nodes.get('user-visitor');
    const admin = await filesystemDb.nodes.get(VIRTUAL_NODE_IDS.profile);
    const profile = admin ?? legacyVisitor ?? await ensureFolder(VIRTUAL_NODE_IDS.users, VIRTUAL_NODE_IDS.profile, 'Admin');
    if (profile.name !== 'Admin') await filesystemDb.nodes.put({ ...profile, name: 'Admin' });

    // Keep the legacy profile ID so every user-created parent reference remains valid.
    const profileId = profile.id;
    const desktop = await ensureFolder(profileId, VIRTUAL_NODE_IDS.desktop, 'Desktop');
    await ensureFolder(profileId, VIRTUAL_NODE_IDS.documents, 'Documents');
    await ensureFolder(profileId, VIRTUAL_NODE_IDS.downloads, 'Downloads');
    await ensureFolder(profileId, VIRTUAL_NODE_IDS.pictures, 'Pictures');
    await ensureFolder(profileId, VIRTUAL_NODE_IDS.videos, 'Videos');
    await ensureFolder(profileId, VIRTUAL_NODE_IDS.music, 'Music');
    await ensureFolder(profileId, VIRTUAL_NODE_IDS.appData, 'AppData');
    await ensureFolder(VIRTUAL_NODE_IDS.appData, VIRTUAL_NODE_IDS.localAppData, 'Local');
    await ensureFolder(VIRTUAL_NODE_IDS.localAppData, VIRTUAL_NODE_IDS.weruAppData, 'Weru OS');
    const projects = await ensureFolder(desktop.id, VIRTUAL_NODE_IDS.projects, 'Projects');
    if (projects.parentId !== desktop.id) await filesystemDb.nodes.put({ ...projects, parentId: desktop.id });
    const audio = await filesystemDb.nodes.get(VIRTUAL_NODE_IDS.audioAlias);
    if (!audio) {
      await filesystemDb.nodes.put({
        ...createFolder(VIRTUAL_NODE_IDS.audioAlias, profileId, 'Audio'),
        kind: 'shortcut',
        mimeType: 'application/x-ms-shortcut',
        shortcutTargetId: VIRTUAL_NODE_IDS.music,
        shortcutTargetPath: 'C:\\Users\\Admin\\Music',
      });
    }
    for (const document of PORTFOLIO_DOCUMENTS) {
      const byId = await filesystemDb.nodes.get(document.id);
      const legacy = byId ?? await filesystemDb.nodes.where('parentId').equals(profileId).filter(node => node.kind === 'file' && node.name.toLowerCase() === document.name.toLowerCase()).first();
      if (legacy) {
        await filesystemDb.nodes.put({ ...legacy, id: document.id, parentId: desktop.id, name: document.name, contentUrl: document.contentUrl, content: legacy.content ?? '', appId: 'notepad', isSystem: true, isReadOnly: true, updatedAt: now() });
      } else {
        await filesystemDb.nodes.put({ ...createFile(document.id, desktop.id, document.name, '', 'text/plain', 'notepad'), contentUrl: document.contentUrl, isSystem: true, isReadOnly: true });
      }
    }
    for (const project of projectsData) {
      const projectId = `project-${project.id}`;
      const folder = await filesystemDb.nodes.get(projectId) ?? createFolder(projectId, projects.id, project.title);
      if (folder.parentId !== projects.id) await filesystemDb.nodes.put({ ...folder, parentId: projects.id });
      if (!(await filesystemDb.nodes.get(projectId))) await filesystemDb.nodes.put(folder);
      const readmeId = `${projectId}-readme`;
      const overviewId = `${projectId}-overview`;
      if (!(await filesystemDb.nodes.get(readmeId))) await filesystemDb.nodes.put(createFile(readmeId, projectId, 'README.md', `# ${project.title}\n\n${project.description}\n\nTechnology: ${project.tech.join(', ')}`, 'text/markdown'));
      if (!(await filesystemDb.nodes.get(overviewId))) await filesystemDb.nodes.put(createFile(overviewId, projectId, 'Project Overview.txt', `${project.title}\n${'='.repeat(project.title.length)}\n\n${project.description}\n\nTechnology: ${project.tech.join(', ')}`));
      if (project.github && !(await filesystemDb.nodes.get(`${projectId}-github`))) await filesystemDb.nodes.put({ ...createFile(`${projectId}-github`, projectId, 'Repository.url', project.github, 'text/uri-list', 'browser'), isSystem: true, isReadOnly: true });
      if (project.live && !(await filesystemDb.nodes.get(`${projectId}-live`))) await filesystemDb.nodes.put({ ...createFile(`${projectId}-live`, projectId, 'Live Site.url', project.live, 'text/uri-list', 'browser'), isSystem: true, isReadOnly: true });
    }
    if (!(await filesystemDb.nodes.get(VIRTUAL_NODE_IDS.settingsJson))) {
      await filesystemDb.nodes.put({ ...createFile(VIRTUAL_NODE_IDS.settingsJson, VIRTUAL_NODE_IDS.weruAppData, 'Settings.json', '{}', 'application/json', 'settings'), isSystem: true, isReadOnly: true });
    }
    const desktopShortcuts = [
      createShortcut(VIRTUAL_NODE_IDS.desktopThisPcShortcut, desktop.id, 'This PC.lnk', ROOT_ID, VIRTUAL_PATHS.drive),
      createShortcut(VIRTUAL_NODE_IDS.desktopProjectsShortcut, desktop.id, 'Projects.lnk', VIRTUAL_NODE_IDS.projects, VIRTUAL_PATHS.projects),
      createShortcut(VIRTUAL_NODE_IDS.desktopContactShortcut, desktop.id, 'Contact.lnk', undefined, undefined, 'mail'),
    ];
    for (const shortcut of desktopShortcuts) if (!(await filesystemDb.nodes.get(shortcut.id))) await filesystemDb.nodes.put({ ...shortcut, isSystem: true, isReadOnly: true });
    if (!(await filesystemDb.meta.get('profile-created-at'))) {
      await filesystemDb.meta.put({ key: 'profile-created-at', value: profile.createdAt });
    }
    await filesystemDb.meta.put({ key: 'layout-version', value: String(VIRTUAL_LAYOUT_VERSION) });
  });
  await syncMediaNodes();
}

export const listChildren = async (parentId: string) => {
  const nodes = await filesystemDb.nodes.where('parentId').equals(parentId).sortBy('name');
  return Promise.all(nodes.map(withDynamicContent));
};

export const getNode = async (id: string) => {
  const node = await filesystemDb.nodes.get(id);
  return node ? withDynamicContent(node) : undefined;
};

export const getCanonicalPath = async (id: string) => {
  const nodes = await filesystemDb.nodes.toArray();
  const byId = new Map(nodes.map(node => [node.id, node]));
  const names: string[] = [];
  const visited = new Set<string>();
  let current = byId.get(id);
  while (current) {
    if (visited.has(current.id)) return undefined;
    visited.add(current.id);
    names.unshift(current.name);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return names.length ? names.join('\\') : undefined;
};

export const getNodeByVirtualPath = async (input: string) => {
  const parts = normalizeVirtualPath(input).split('\\').filter(Boolean);
  if (!parts.length) return undefined;
  const allNodes = await filesystemDb.nodes.toArray();
  let current = allNodes.find(node => node.parentId === null && node.name.toLowerCase() === parts[0].toLowerCase());
  for (const part of parts.slice(1)) {
    if (!current) return undefined;
    current = allNodes.find(node => node.parentId === current?.id && node.name.toLowerCase() === part.toLowerCase());
  }
  return current;
};

export const resolveShortcut = async (node: VfsNode, depth = 0): Promise<VfsNode | undefined> => {
  if (node.kind !== 'shortcut') return node;
  if (depth >= 8) return undefined;
  const target = node.shortcutTargetId
    ? await filesystemDb.nodes.get(node.shortcutTargetId)
    : node.shortcutTargetPath ? await getNodeByVirtualPath(node.shortcutTargetPath) : undefined;
  return target ? resolveShortcut(target, depth + 1) : undefined;
};

export const getShortcutTargetPath = async (node: VfsNode) => {
  if (node.kind !== 'shortcut') return getCanonicalPath(node.id);
  if (node.shortcutTargetPath) return node.shortcutTargetPath;
  const target = await resolveShortcut(node);
  return target ? getCanonicalPath(target.id) : undefined;
};

export const createFolderNode = async (parentId: string, name: string) => {
  const timestamp = now();
  const id = `folder-${crypto.randomUUID()}`;
  const node = createFolder(id, parentId, name);
  node.createdAt = timestamp;
  node.updatedAt = timestamp;
  await filesystemDb.nodes.add(node);
  return node;
};

export const createTextFileNode = async (parentId: string, name: string, content = '') => {
  const id = `file-${crypto.randomUUID()}`;
  const node = createFile(id, parentId, name, content, name.toLowerCase().endsWith('.md') ? 'text/markdown' : 'text/plain', 'notepad');
  await filesystemDb.nodes.add(node);
  return node;
};

const assertWritableNode = (node: VfsNode | undefined) => {
  if (!node) throw new Error('File or folder not found');
  if (node.isSystem || node.isReadOnly || node.id === ROOT_ID) throw new Error('This item is protected by Weru OS');
}

const descendantsOf = (root: VfsNode, allNodes: VfsNode[]) => allNodes.filter(candidate => {
  let parentId = candidate.parentId;
  while (parentId) {
    if (parentId === root.id) return true;
    parentId = allNodes.find(parent => parent.id === parentId)?.parentId ?? null;
  }
  return candidate.id === root.id;
});

const availableName = (name: string, siblings: VfsNode[], ignoredId?: string) => {
  const taken = new Set(siblings.filter(node => node.id !== ignoredId).map(node => node.name.toLowerCase()));
  if (!taken.has(name.toLowerCase())) return name;
  const extensionIndex = name.lastIndexOf('.');
  const stem = extensionIndex > 0 ? name.slice(0, extensionIndex) : name;
  const extension = extensionIndex > 0 ? name.slice(extensionIndex) : '';
  let suffix = 2;
  while (taken.has(`${stem} (${suffix})${extension}`.toLowerCase())) suffix += 1;
  return `${stem} (${suffix})${extension}`;
};

export const renameNode = async (id: string, name: string) => {
  const trimmed = name.trim();
  if (!trimmed || /[\\/:*?"<>|]/.test(trimmed)) throw new Error('Enter a valid item name');
  const node = await filesystemDb.nodes.get(id);
  assertWritableNode(node);
  const siblings = node?.parentId ? await filesystemDb.nodes.where('parentId').equals(node.parentId).toArray() : [];
  const renamed = { ...node!, name: availableName(trimmed, siblings, id), updatedAt: now() };
  await filesystemDb.nodes.put(renamed);
  return renamed;
};

export const moveNode = async (id: string, destinationId: string) => {
  const node = await filesystemDb.nodes.get(id);
  const destination = await filesystemDb.nodes.get(destinationId);
  assertWritableNode(node);
  if (!destination || destination.kind !== 'folder') throw new Error('Destination folder not found');
  const allNodes = await filesystemDb.nodes.toArray();
  if (descendantsOf(node!, allNodes).some(candidate => candidate.id === destination.id)) throw new Error('An item cannot be moved inside itself');
  const siblings = allNodes.filter(candidate => candidate.parentId === destination.id);
  const moved = { ...node!, parentId: destination.id, name: availableName(node!.name, siblings), updatedAt: now() };
  await filesystemDb.nodes.put(moved);
  return moved;
};

export const copyNode = async (id: string, destinationId: string) => {
  const source = await filesystemDb.nodes.get(id);
  const destination = await filesystemDb.nodes.get(destinationId);
  if (!source) throw new Error('Item not found');
  if (!destination || destination.kind !== 'folder') throw new Error('Destination folder not found');
  const allNodes = await filesystemDb.nodes.toArray();
  const snapshots = descendantsOf(source, allNodes);
  const idMap = new Map<string, string>();
  snapshots.forEach(snapshot => idMap.set(snapshot.id, `${snapshot.kind}-${crypto.randomUUID()}`));
  const siblings = allNodes.filter(candidate => candidate.parentId === destination.id);
  const copied = snapshots.map(snapshot => {
    const parentId = snapshot.id === source.id ? destination.id : idMap.get(snapshot.parentId ?? '') ?? destination.id;
    const copy = { ...snapshot, id: idMap.get(snapshot.id)!, parentId, isSystem: false, isReadOnly: false, name: snapshot.id === source.id ? availableName(snapshot.name, siblings) : snapshot.name, createdAt: now(), updatedAt: now() };
    return copy;
  });
  await filesystemDb.nodes.bulkAdd(copied);
  return copied[0];
};

export const updateTextFile = async (id: string, content: string) => {
  await seedFilesystem();
  const node = await filesystemDb.nodes.get(id);
  if (!node) throw new Error('File not found');
  if (node.kind !== 'file' || !['text/plain', 'text/markdown', 'application/json'].includes(node.mimeType)) {
    throw new Error('Only text files can be edited');
  }
  if (node.isReadOnly || node.isSystem) throw new Error('This file is protected by Weru OS');
  const updated = { ...node, content, size: content.length, updatedAt: now() };
  await filesystemDb.nodes.put(updated);
  return updated;
};

/** Cache fetched, read-only public text assets in IndexedDB for repeat and offline reads. */
export const cacheTextAssetContent = async (id: string, content: string) => {
  const node = await filesystemDb.nodes.get(id);
  if (!node || node.kind !== 'file' || !node.contentUrl || !['text/plain', 'text/markdown'].includes(node.mimeType)) return;
  await filesystemDb.nodes.put({ ...node, content, size: content.length, updatedAt: now() });
};

export const deleteNodeToTrash = async (id: string) => {
  await filesystemDb.transaction('rw', filesystemDb.nodes, filesystemDb.trash, async () => {
    const node = await filesystemDb.nodes.get(id);
    assertWritableNode(node);
    const allNodes = await filesystemDb.nodes.toArray();
    const descendants = descendantsOf(node!, allNodes);
    const entry: TrashEntry = {
      id: `trash-${id}`,
      originalParentId: node!.parentId,
      originalName: node!.name,
      deletedAt: now(),
      nodeSnapshots: descendants,
    };
    await filesystemDb.trash.put(entry);
    await filesystemDb.nodes.bulkDelete(descendants.map(candidate => candidate.id));
  });
};

export const restoreTrashEntry = async (trashId: string) => {
  await filesystemDb.transaction('rw', filesystemDb.nodes, filesystemDb.trash, async () => {
    const entry = await filesystemDb.trash.get(trashId);
    if (!entry) return;
    const parentExists = entry.originalParentId ? await filesystemDb.nodes.get(entry.originalParentId) : true;
    const snapshots = entry.nodeSnapshots ?? (entry.nodeSnapshot ? [entry.nodeSnapshot] : []);
    const restoredParentId = parentExists ? entry.originalParentId : 'folder-desktop';
    const siblings = entry.originalParentId ? await filesystemDb.nodes.where('parentId').equals(entry.originalParentId).toArray() : [];
    const restored = snapshots.map((snapshot, index) => ({
      ...snapshot,
      parentId: snapshot.id === snapshots[0]?.id ? restoredParentId : snapshot.parentId,
      name: index === 0 ? availableName(snapshot.name, siblings) : snapshot.name,
      updatedAt: now(),
    }));
    await filesystemDb.nodes.bulkPut(restored);
    await filesystemDb.trash.delete(trashId);
  });
};

export const listTrash = async () => filesystemDb.trash.orderBy('deletedAt').reverse().toArray();

export const deleteTrashEntry = async (trashId: string) => {
  await filesystemDb.trash.delete(trashId);
};

export const searchNodes = async (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return filesystemDb.nodes.filter(node => node.name.toLowerCase().includes(normalized)).toArray();
};

export const emptyTrash = async () => filesystemDb.trash.clear();

export const resetFilesystem = async () => {
  await filesystemDb.transaction('rw', filesystemDb.nodes, filesystemDb.trash, filesystemDb.meta, async () => {
    await filesystemDb.nodes.clear();
    await filesystemDb.trash.clear();
    await filesystemDb.meta.clear();
  });
  await seedFilesystem();
};
