import type { WindowInstance, WindowRect } from '../os/os-types';
import type { VfsNode } from '../filesystem/filesystem-types';
import { clampWindowRect97, getDesktopBounds97, type DesktopBounds97 } from '../../wm/geometry97';
import { getStitchExplorerRect97 } from './explorer-window-geometry97';

const projectExplorerBase: WindowRect = { x: 88, y: 26, width: 620, height: 430 };
const projectNotepadBase: WindowRect = { x: 320, y: 90, width: 580, height: 450 };

/** Geometry for the project-folder Explorer shown in the Explorer + Notepad Stitch screen. */
export function getStitchProjectExplorerRect97(cascade = 0, bounds: DesktopBounds97 = getDesktopBounds97()): WindowRect {
  return clampWindowRect97({
    ...projectExplorerBase,
    x: projectExplorerBase.x + cascade,
    y: projectExplorerBase.y + cascade,
    width: Math.min(projectExplorerBase.width, Math.floor(bounds.width * 0.9)),
  }, undefined, undefined, bounds);
}

/** Geometry for a project document opened in Notepad from that Stitch screen. */
export function getStitchProjectNotepadRect97(cascade = 0, bounds: DesktopBounds97 = getDesktopBounds97()): WindowRect {
  const wideLayout = bounds.width >= 768;
  return clampWindowRect97({
    ...projectNotepadBase,
    x: (wideLayout ? projectNotepadBase.x : 180) + cascade,
    y: (wideLayout ? projectNotepadBase.y : 110) + cascade,
    width: Math.min(projectNotepadBase.width, Math.floor(bounds.width * 0.95)),
  }, undefined, undefined, bounds);
}

/** Apply the screen-specific Explorer geometry only to actual project folders. */
export function getProjectFolderExplorerRect97(locationId: string, existingProjectWindows = 0, bounds: DesktopBounds97 = getDesktopBounds97()): WindowRect | undefined {
  if (!locationId.startsWith('project-')) return undefined;
  return getStitchProjectExplorerRect97(Math.min(existingProjectWindows, 4) * 44, bounds);
}

/** Resolve source-authored placement when an existing Explorer navigates to a new folder. */
export function getExplorerNavigationRect97(
  locationId: string,
  windows: Array<Pick<WindowInstance, 'id' | 'appId' | 'locationId'>>,
  currentWindowId: string,
  bounds: DesktopBounds97 = getDesktopBounds97(),
): WindowRect | undefined {
  const namedSourceRect = getStitchExplorerRect97(locationId);
  if (namedSourceRect) return namedSourceRect;

  const otherProjectWindows = windows.filter(window =>
    window.id !== currentWindowId
    && window.appId === 'explorer'
    && window.locationId?.startsWith('project-'),
  ).length;
  return getProjectFolderExplorerRect97(locationId, otherProjectWindows, bounds);
}

/** Apply the screen-specific Notepad geometry only to documents owned by project folders. */
export function getProjectDocumentNotepadRect97(node: Pick<VfsNode, 'id' | 'parentId'>, existingProjectDocuments = 0, bounds: DesktopBounds97 = getDesktopBounds97()): WindowRect | undefined {
  const isProjectDocument = node.id.startsWith('project-') || Boolean(node.parentId?.startsWith('project-'));
  if (!isProjectDocument) return undefined;
  return getStitchProjectNotepadRect97(Math.min(existingProjectDocuments, 4) * 44, bounds);
}
