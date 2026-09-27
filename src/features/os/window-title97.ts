import type { WindowInstance } from './os-types';

type DocumentWindow = Pick<WindowInstance, 'id' | 'appId' | 'fileId' | 'title'>;

/** Return title repairs for restored Notepad windows whose VFS file was renamed. */
export function planNotepadWindowTitleRepairs(
  windows: readonly DocumentWindow[],
  documentNames: ReadonlyMap<string, string>,
) {
  return windows.flatMap(window => {
    if (window.appId !== 'notepad' || !window.fileId) return [];
    const currentName = documentNames.get(window.fileId);
    return currentName && currentName !== window.title
      ? [{ windowId: window.id, title: currentName }]
      : [];
  });
}
