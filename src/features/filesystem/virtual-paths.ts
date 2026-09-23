/** Canonical Weru 97 virtual filesystem paths. */
export const VIRTUAL_PATHS = {
  root: 'C:\\',
  myDocuments: 'C:\\My Documents',
  projects: 'C:\\Projects',
  programFiles: 'C:\\Program Files',
  windows: 'C:\\Windows',
  windowsMedia: 'C:\\Windows\\Media',
  windowsSystem: 'C:\\Windows\\System',
  recycled: 'C:\\Recycled',
  startMenu: 'C:\\Windows\\Start Menu',
  // Compatibility names retained while legacy content surfaces are replaced.
  drive: 'C:\\',
  desktop: 'C:\\Desktop',
  documents: 'C:\\My Documents',
  downloads: 'C:\\My Documents\\Downloads',
  pictures: 'C:\\My Pictures',
  videos: 'C:\\Videos',
  music: 'C:\\Windows\\Media',
  users: 'C:\\Users',
  profile: 'C:\\My Documents',
  appData: 'C:\\Windows\\System',
  localAppData: 'C:\\Windows\\System',
  weruAppData: 'C:\\Windows\\System',
  settingsJson: 'C:\\Windows\\System\\Settings.json',
  audioAlias: 'C:\\Windows\\Media',
  profileJson: 'C:\\Weru Profile.json',
  system32: 'C:\\Windows\\System',
} as const;

const canonicalPathSegments = new Map(
  Object.values(VIRTUAL_PATHS)
    .flatMap((path) => path.split('\\').filter(Boolean))
    .map((segment) => [segment.toLowerCase(), segment]),
);

export const VIRTUAL_NODE_IDS = {
  root: 'root',
  desktop: 'folder-desktop',
  myDocuments: 'folder-my-documents',
  projects: 'folder-projects',
  programFiles: 'folder-program-files',
  windows: 'folder-windows',
  windowsMedia: 'folder-windows-media',
  windowsSystem: 'folder-windows-system',
  recycled: 'folder-recycled',
  startMenu: 'folder-start-menu',
  // Compatibility names retained while legacy components are migrated.
  drive: 'root',
  users: 'folder-users',
  profile: 'folder-my-documents',
  documents: 'folder-my-documents',
  downloads: 'folder-downloads',
  pictures: 'folder-pictures',
  videos: 'folder-videos',
  music: 'folder-windows-media',
  appData: 'folder-windows-system',
  localAppData: 'folder-windows-system',
  weruAppData: 'folder-windows-system',
  settingsJson: 'file-settings-json',
  audioAlias: 'folder-windows-media',
  profileJson: 'file-weru-profile',
  system32: 'folder-windows-system',
  desktopProjectsShortcut: 'desktop-shortcut-projects',
  desktopThisPcShortcut: 'desktop-shortcut-this-pc',
  desktopContactShortcut: 'desktop-shortcut-contact',
  desktopPicturesShortcut: 'desktop-lnk-my-pictures',
} as const;

export const VIRTUAL_LAYOUT_VERSION = 8;

export const normalizeVirtualPath = (input: string) => {
  const raw = input.trim().replaceAll('/', '\\');
  const parts = raw.split('\\').filter(Boolean);
  const normalized: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (normalized.length > 1) normalized.pop();
      continue;
    }
    normalized.push(canonicalPathSegments.get(part.toLowerCase()) ?? part);
  }
  if (!normalized.length) return VIRTUAL_PATHS.root;
  if (normalized[0].toLowerCase() === 'c:') normalized[0] = 'C:';
  return normalized.join('\\');
};
