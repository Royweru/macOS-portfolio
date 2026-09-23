'use client';

import ExplorerContent from '../../windows/ExplorerContent';
import type { OpenTarget } from '../../features/os/os-types';

export default function Explorer97(props: { initialFolderId?: string; onOpenTarget: (target: OpenTarget) => void }) {
  return <div className="win97-explorer"><ExplorerContent key={props.initialFolderId ?? 'root'} {...props} /></div>;
}
