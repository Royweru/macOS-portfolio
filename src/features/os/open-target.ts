import type { OpenTarget } from './os-types';
import { getNode, resolveShortcut } from '../filesystem/filesystem-service';
import type { VfsNode } from '../filesystem/filesystem-types';
import { resolveAppForExtension } from '../apps/app-registry';

export const isAllowedExternalUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

export const targetForNode = (node: VfsNode): OpenTarget => {
  if (node.kind === 'folder') return { kind: 'folder', nodeId: node.id, title: node.name };
  if (node.kind === 'shortcut' && node.appId && !node.shortcutTargetId && !node.shortcutTargetPath) return { kind: 'application', appId: node.appId, title: node.name };
  if (node.kind === 'shortcut') return { kind: 'file', nodeId: node.id, title: node.name };
  if (node.media) return { kind: 'media', nodeId: node.id, title: node.name };
  if (node.mimeType === 'text/uri-list' || node.name.toLowerCase().endsWith('.url')) return { kind: 'external', url: node.content?.trim() ?? '', label: node.name };
  return { kind: 'file', nodeId: node.id, title: node.name, preferredAppId: resolveAppForExtension(node.name)?.id };
};

export interface ResolvedTarget {
  target: OpenTarget;
  node?: VfsNode;
  resolvedNode?: VfsNode;
  error?: string;
}

export async function resolveTarget(target: OpenTarget): Promise<ResolvedTarget> {
  if (target.kind === 'external') {
    return isAllowedExternalUrl(target.url)
      ? { target }
      : { target, error: 'This external link is not allowed by Weru OS.' };
  }
  if (target.kind === 'application' || target.kind === 'recycle-bin') return { target };

  const node = await getNode(target.nodeId);
  if (!node) return { target, error: 'The requested item no longer exists.' };
  if (node.kind === 'shortcut' && node.appId && !node.shortcutTargetId && !node.shortcutTargetPath) {
    return { target: { kind: 'application', appId: node.appId, title: node.name }, node, resolvedNode: node };
  }
  const resolvedNode = node.kind === 'shortcut' ? await resolveShortcut(node) : node;
  if (!resolvedNode) return { target, node, error: 'This shortcut is broken.' };
  return { target, node, resolvedNode };
}
