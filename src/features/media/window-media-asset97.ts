import type { MediaAsset } from './media-types';
import type { VfsNode } from '../filesystem/filesystem-types';

export const mediaAssetFromVfsNode97 = (node: VfsNode | undefined): MediaAsset | undefined => {
  if (!node?.media) return undefined;
  return {
    id: node.media.mediaId,
    projectId: node.media.projectId,
    kind: node.media.kind,
    title: node.media.title,
    source: node.media.source,
    mimeType: node.mimeType,
    poster: node.media.poster,
    captionSource: node.media.captionSource,
    durationSeconds: node.media.durationSeconds,
    description: node.media.description,
  };
};

/** A file-bound window must wait for its own VFS record, never borrow the last opened asset. */
export const selectWindowMediaAsset97 = (
  fileId: string | undefined,
  fileNode: VfsNode | undefined,
  fallbackAsset: MediaAsset | undefined,
): MediaAsset | undefined => {
  if (!fileId) return fallbackAsset;
  return fileNode?.id === fileId ? mediaAssetFromVfsNode97(fileNode) : undefined;
};
