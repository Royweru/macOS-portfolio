import type { VfsNode } from '../features/filesystem/filesystem-types';
import { VIRTUAL_NODE_IDS } from '../features/filesystem/virtual-paths';

export type ExplorerViewMode97 = 'icons' | 'list' | 'details';

/** Stitch's project Explorer states open in Details; personal folders keep the icon default. */
export function getExplorerInitialView97(folderId?: string): ExplorerViewMode97 {
  return folderId === VIRTUAL_NODE_IDS.projects || folderId?.startsWith('project-')
    ? 'details'
    : 'icons';
}

function formatSize97(bytes: number): string {
  const safeBytes = Number.isFinite(bytes) ? Math.max(0, bytes) : 0;
  if (safeBytes < 1024) return `${safeBytes} ${safeBytes === 1 ? 'byte' : 'bytes'}`;
  if (safeBytes < 1024 * 1024) return `${(safeBytes / 1024).toFixed(1)} KB`;
  return `${(safeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatModified97(value: string): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const year = `${date.getFullYear()}`.slice(-2);
  const hours = date.getHours();
  const clock = `${hours % 12 || 12}:${`${date.getMinutes()}`.padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
  return `${month}/${day}/${year} ${clock}`;
}

function getFileType97(node: VfsNode): string {
  if (node.kind === 'folder') return 'File Folder';
  if (node.kind === 'shortcut') return 'Shortcut';
  if (node.mimeType === 'text/markdown') return 'Markdown Document';
  if (node.mimeType === 'text/plain') return 'Text Document';
  if (node.mimeType === 'application/json') return 'JSON File';
  if (node.mimeType.startsWith('video/')) return 'Video File';
  if (node.mimeType.startsWith('audio/')) return 'Audio File';
  if (node.mimeType.startsWith('image/')) return 'Image File';
  return 'File';
}

/** Values ordered to match the Stitch Explorer columns: Size, Type, Date Modified. */
export function getExplorerDetails97(node: VfsNode) {
  return {
    size: node.kind === 'folder' ? '' : formatSize97(node.size),
    type: getFileType97(node),
    modified: formatModified97(node.updatedAt),
  };
}
