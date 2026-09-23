'use client';

import { DOCUMENTS, PROJECTS } from '../../data/portfolio-manifest';
import projectsData from '../../data/projects_data.json';
import { PORTFOLIO_DOCUMENTS } from '../../data/portfolio-document-manifest';
import { PROJECT_MEDIA_MANIFEST } from '../../data/project-media-manifest';
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

const mediaParent = (kind: 'video' | 'audio' | 'image') => kind === 'video'
  ? VIRTUAL_NODE_IDS.videos
  : kind === 'audio' ? VIRTUAL_NODE_IDS.music : VIRTUAL_NODE_IDS.pictures;

const mediaPath = (asset: { kind: 'video' | 'audio' | 'image'; source: string }) => {
  const folder = asset.kind === 'video' ? VIRTUAL_PATHS.videos : asset.kind === 'audio' ? VIRTUAL_PATHS.music : VIRTUAL_PATHS.pictures;
  const filename = decodeURIComponent(asset.source.split('/').pop() ?? asset.source);
  return `${folder}\\${filename}`;
};

const createMediaNodes = () => PROJECT_MEDIA_MANIFEST.flatMap(manifest => manifest.assets.filter(asset => isBundledMediaSource(asset) && isSupportedMediaMimeType(asset.kind, asset.mimeType)).flatMap(asset => {
  const projectNodeId = `project-${manifest.projectId}`;
  const mediaNodeId = `media-${asset.id}`;
  const sourceNode: VfsNode = {
    ...createFile(mediaNodeId, mediaParent(asset.kind), decodeURIComponent(asset.source.split('/').pop() ?? asset.id), '', asset.mimeType, 'media-player'),
    size: 0,
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
  const shortcut: VfsNode = {
    ...createFile(`shortcut-${asset.id}`, projectNodeId, `${asset.title}.lnk`, '', 'application/x-ms-shortcut', 'media-player'),
    kind: 'shortcut',
    shortcutTargetId: mediaNodeId,
    shortcutTargetPath: mediaPath(asset),
    media: sourceNode.media,
  };
  return [sourceNode, shortcut];
}));

const syncMediaNodes = async () => {
  const nodes = createMediaNodes();
  if (nodes.length) await filesystemDb.nodes.bulkPut(nodes);
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
  const accessoriesId = 'folder-accessories';
  const gamesId = 'folder-games';
  const nodes: VfsNode[] = [
    createFolder(ROOT_ID, null, 'C:'),
    createFolder(desktopId, ROOT_ID, 'Desktop'),
    createFolder(myDocumentsId, ROOT_ID, 'My Documents'),
    createFolder(videosId, ROOT_ID, 'Videos'),
    createFolder(picturesId, ROOT_ID, 'My Pictures'),
    createFolder(projectsId, ROOT_ID, 'Projects'),
    createFolder(programFilesId, ROOT_ID, 'Program Files'),
    createFolder(windowsId, ROOT_ID, 'Windows'),
    createFolder(windowsMediaId, windowsId, 'Media'),
    { ...createFolder(windowsSystemId, windowsId, 'System'), isSystem: true },
    { ...createFolder(recycledId, ROOT_ID, 'Recycled'), isSystem: true },
    { ...createFolder(startMenuId, windowsId, 'Start Menu'), isSystem: true },
    createFolder('folder-images', picturesId, 'Screenshots'),
    createFolder(accessoriesId, programFilesId, 'Accessories'),
    createFolder(gamesId, programFilesId, 'Games'),
    // Desktop Shortcuts
    createShortcut('desktop-lnk-projects', desktopId, 'Projects.lnk', projectsId, VIRTUAL_PATHS.projects, 'explorer'),
    createShortcut('desktop-lnk-my-documents', desktopId, 'My Documents.lnk', myDocumentsId, VIRTUAL_PATHS.myDocuments, 'explorer'),
    createShortcut('desktop-lnk-videos', desktopId, 'Videos.lnk', videosId, VIRTUAL_PATHS.videos, 'explorer'),
    createShortcut(VIRTUAL_NODE_IDS.desktopPicturesShortcut, desktopId, 'My Pictures.lnk', picturesId, VIRTUAL_PATHS.pictures, 'explorer'),
    createShortcut('desktop-lnk-music', desktopId, 'My Music.lnk', windowsMediaId, VIRTUAL_PATHS.music, 'cd-player'),
    { ...createFile('root-io-sys', ROOT_ID, 'IO.SYS', '', 'application/octet-stream', 'msdos'), isHidden: true, isSystem: true, isReadOnly: true },
    { ...createFile('root-msdos-sys', ROOT_ID, 'MSDOS.SYS', '', 'application/octet-stream', 'msdos'), isHidden: true, isSystem: true, isReadOnly: true },
    { ...createFile('root-command-com', ROOT_ID, 'COMMAND.COM', 'Weru 97 command processor', 'application/octet-stream', 'msdos'), isHidden: true, isSystem: true, isReadOnly: true },
    { ...createFile('file-secrets', windowsSystemId, 'secrets.txt', 'You found the quiet corner of Weru 97.\n\nTry `matrix` in MS-DOS Prompt.', 'text/plain', 'notepad'), isSystem: true, isReadOnly: true },
    { ...createFile(VIRTUAL_NODE_IDS.settingsJson, windowsSystemId, 'Settings.json', '{}', 'application/json', 'control-panel'), isSystem: true, isReadOnly: true },
    { ...createFile(VIRTUAL_NODE_IDS.profileJson, ROOT_ID, 'Weru Profile.json', '', 'application/json', 'system-properties'), isSystem: true, isReadOnly: true },
    {
      ...createFile('file-simulation-icons', 'folder-images', 'windows_97_simulation_icons.jpg', '', 'image/jpeg', 'paint'),
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
    ...createFile(documentNodeIds[document.id] ?? `file-${document.id}`, myDocumentsId, document.filename, document.content, 'text/plain', 'notepad'),
    isSystem: document.readOnly,
    isReadOnly: document.readOnly,
  })));

  for (const project of PROJECTS) {
    const projectId = `project-${project.id}`;
    nodes.push(createFolder(projectId, projectsId, project.folderName));

    if (project.readme) {
      nodes.push(createFile(`${projectId}-readme`, projectId, 'README.txt', project.readme, 'text/plain', 'notepad'));
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

    if (project.files?.demo) {
      nodes.push({
        ...createFile(`${projectId}-demo`, projectId, 'demo.avi', '', project.files.demo.mimeType ?? 'video/mp4', 'media-player'),
        media: {
          mediaId: `${project.id}-demo`,
          projectId: project.legacyId ?? 0,
          kind: 'video',
          source: project.files.demo.src,
          poster: project.files.demo.poster,
          title: project.files.demo.title ?? `${project.title} Demo`,
          durationSeconds: project.files.demo.durationSeconds,
        },
      });
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

  const accessories = [
    ['notepad.exe.lnk', 'notepad'], ['calc.exe.lnk', 'calculator'], ['paint.exe.lnk', 'paint'], ['iexplore.exe.lnk', 'ie4'],
  ] as const;
  const games = [['minesweeper.exe.lnk', 'minesweeper']] as const;
  nodes.push(...accessories.map(([name, appId]) => createShortcut(`shortcut-${appId}`, accessoriesId, name, undefined, undefined, appId)));
  nodes.push(...games.map(([name, appId]) => createShortcut(`shortcut-${appId}`, gamesId, name, undefined, undefined, appId)));
  return nodes;
};

async function migrateWin97Layout() {
  const nodes = createWin97Nodes();
  await filesystemDb.transaction('rw', filesystemDb.nodes, filesystemDb.meta, async () => {
    for (const node of nodes) {
      const existing = await filesystemDb.nodes.get(node.id);
      if (!existing || node.isSystem || node.kind === 'folder') await filesystemDb.nodes.put(node);
    }
    await filesystemDb.meta.put({ key: 'layout-version', value: String(VIRTUAL_LAYOUT_VERSION) });
  });
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
    ...PORTFOLIO_DOCUMENTS.map(document => ({ ...createFile(document.id, desktopId, document.name, document.content, 'text/plain', 'notepad'), isSystem: true, isReadOnly: true })),
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
        await filesystemDb.nodes.put({ ...legacy, id: document.id, parentId: desktop.id, name: document.name, content: legacy.content || document.content, appId: 'notepad', isSystem: true, isReadOnly: true, updatedAt: now() });
      } else {
        await filesystemDb.nodes.put({ ...createFile(document.id, desktop.id, document.name, document.content), isSystem: true, isReadOnly: true });
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
  const node = createFile(id, parentId, name, content);
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
