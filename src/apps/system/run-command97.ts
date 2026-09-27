import { getNodeByVirtualPath, searchNodes } from '../../features/filesystem/filesystem-service';
import { normalizeVirtualPath } from '../../features/filesystem/virtual-paths';
import { isAllowedExternalUrl, targetForNode } from '../../features/os/open-target';
import type { OpenTarget } from '../../features/os/os-types';
import type { VfsNode } from '../../features/filesystem/filesystem-types';
import type { WindowId } from '../../types';

const APP_ALIASES: Record<string, WindowId> = {
  calc: 'calculator', calculator: 'calculator',
  winmine: 'minesweeper', minesweeper: 'minesweeper',
  iexplore: 'ie4', 'internet explorer': 'ie4',
  msdos: 'msdos', 'command prompt': 'msdos', cmd: 'msdos',
  cdplayer: 'cd-player', 'cd player': 'cd-player',
  mspaint: 'paint', paint: 'paint',
  explorer: 'explorer', 'file explorer': 'explorer',
  notepad: 'notepad',
  control: 'control-panel', 'control panel': 'control-panel', settings: 'control-panel',
  projects: 'projects', 'my documents': 'explorer',
  'media player': 'media-player', 'weru media player': 'media-player', 'windows media player': 'media-player',
  'outlook express': 'mail', mail: 'mail',
  'recycle bin': 'recycle-bin', find: 'find', shutdown: 'shutdown',
};

const KNOWN_FILE_EXTENSIONS = new Set([
  'avi', 'bmp', 'gif', 'htm', 'html', 'ini', 'jpeg', 'jpg', 'json', 'lnk', 'log',
  'md', 'mid', 'midi', 'mp3', 'mp4', 'png', 'spec', 'txt', 'url', 'wav', 'webm',
]);

export type ParsedRunCommand97 =
  | { kind: 'application'; appId: WindowId }
  | { kind: 'external'; url: string }
  | { kind: 'virtual-path'; path: string }
  | { kind: 'lookup'; query: string }
  | { kind: 'error'; message: string };

export type RunFileTargetResult97 =
  | { target: OpenTarget }
  | { error: string };

function unquote(value: string): string | undefined {
  const trimmed = value.trim();
  const startsQuoted = trimmed.startsWith('"');
  const endsQuoted = trimmed.endsWith('"');
  if (startsQuoted !== endsQuoted) return undefined;
  return startsQuoted ? trimmed.slice(1, -1).trim() : trimmed;
}

function isWebHost(value: string): boolean {
  const host = value.match(/^(?:www\.)?(?:[a-z0-9-]+\.)+([a-z]{2,})(?:[/?#].*)?$/i);
  if (!host) return false;
  return !KNOWN_FILE_EXTENSIONS.has(host[1].toLowerCase());
}

export function parseRunCommand97(input: string): ParsedRunCommand97 {
  const value = unquote(input);
  if (value === undefined) return { kind: 'error', message: 'Use matching quotation marks around a path.' };
  if (!value) return { kind: 'error', message: 'Type the name of a program, folder, document, or web address.' };

  const normalized = value.toLowerCase().replace(/\s+/g, ' ');
  if (normalized === 'regedit' || normalized === 'format c:' || normalized.startsWith('format c: ')) {
    return { kind: 'error', message: 'Access denied. This protected Weru 97 runtime cannot modify system state.' };
  }

  const appId = APP_ALIASES[normalized];
  if (appId) return { kind: 'application', appId };

  if (isAllowedExternalUrl(value)) return { kind: 'external', url: value };
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^[a-z]:[\\/]/i.test(value)) {
    return { kind: 'error', message: 'Only HTTP and HTTPS web addresses can be opened from Run.' };
  }

  if (isWebHost(value)) {
    const url = `https://${value}`;
    if (isAllowedExternalUrl(url)) return { kind: 'external', url };
  }

  if (/^[a-z]:[\\/]/i.test(value) || /[\\/]/.test(value)) {
    const drivePath = /^[a-z]:/i.test(value) ? value : `C:\\${value.replace(/^[\\/]+/, '')}`;
    return { kind: 'virtual-path', path: normalizeVirtualPath(drivePath) };
  }

  return { kind: 'lookup', query: value };
}

export interface RunFileLookups97 {
  getByPath: (path: string) => Promise<VfsNode | undefined>;
  searchByName: (query: string) => Promise<VfsNode[]>;
}

const defaultLookups: RunFileLookups97 = {
  getByPath: getNodeByVirtualPath,
  searchByName: searchNodes,
};

export async function resolveRunFileTarget97(
  command: Extract<ParsedRunCommand97, { kind: 'virtual-path' | 'lookup' }>,
  lookups: RunFileLookups97 = defaultLookups,
): Promise<RunFileTargetResult97> {
  if (command.kind === 'virtual-path') {
    const node = await lookups.getByPath(command.path);
    return node
      ? { target: targetForNode(node) }
      : { error: `Weru 97 cannot find '${command.path}'. Check the path and try again.` };
  }

  const exactMatches = (await lookups.searchByName(command.query))
    .filter(node => node.name.toLowerCase() === command.query.toLowerCase());
  if (exactMatches.length === 1) return { target: targetForNode(exactMatches[0]) };
  if (exactMatches.length > 1) return { error: `More than one item is named '${command.query}'. Enter its full C: path.` };
  return { error: `Windows cannot find '${command.query}'. Check the spelling and try again.` };
}
