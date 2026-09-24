export type VfsNodeKind = 'folder' | 'file' | 'shortcut';

export type MediaKind = 'video' | 'audio' | 'image';

export interface MediaMetadata {
  mediaId: string;
  projectId: number;
  kind: MediaKind;
  source: string;
  poster?: string;
  title: string;
  description?: string;
  durationSeconds?: number;
  captionSource?: string;
}

export interface VfsNode {
  id: string;
  parentId: string | null;
  name: string;
  kind: VfsNodeKind;
  mimeType: string;
  appId?: string;
  content?: string;
  /** Same-origin public text asset loaded by the owning app on demand. */
  contentUrl?: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  isHidden?: boolean;
  isSystem?: boolean;
  isReadOnly?: boolean;
  shortcutTargetId?: string;
  shortcutTargetPath?: string;
  media?: MediaMetadata;
}

export interface TrashEntry {
  id: string;
  originalParentId: string | null;
  originalName: string;
  deletedAt: string;
  nodeSnapshots: VfsNode[];
  /** Legacy single-node snapshot retained for forward-compatible migrations. */
  nodeSnapshot?: VfsNode;
}

export interface MetaRecord {
  key: string;
  value: string;
}
