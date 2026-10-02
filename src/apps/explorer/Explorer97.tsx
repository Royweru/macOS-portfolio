'use client';

import ExplorerContent from '../../windows/ExplorerContent';
import type { VfsNode } from '../../features/filesystem/filesystem-types';
import type { OpenTarget } from '../../features/os/os-types';

export default function Explorer97(props: {
  initialFolderId?: string;
  onOpenTarget: (target: OpenTarget) => void;
  onFolderChange?: (folder: Pick<VfsNode, 'id' | 'name'>) => void;
}) {
  return <div className="win97-explorer"><ExplorerContent key={props.initialFolderId ?? 'root'} {...props} /></div>;
}
