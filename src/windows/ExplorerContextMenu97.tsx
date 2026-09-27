import type { CSSProperties } from 'react';
import type { VfsNode } from '../features/filesystem/filesystem-types';

interface ExplorerContextMenu97Props {
  x: number;
  y: number;
  node?: VfsNode;
  clipboardAvailable: boolean;
  onOpenNode: (node: VfsNode) => void;
  onCopy: (node: VfsNode) => void;
  onCut: (node: VfsNode) => void;
  onRename: (node: VfsNode) => void;
  onDelete: (node: VfsNode) => void;
  onNewFolder: () => void;
  onNewFile: () => void;
  onPaste: () => void;
  onRefresh: () => void;
}

export default function ExplorerContextMenu97({
  x,
  y,
  node,
  clipboardAvailable,
  onOpenNode,
  onCopy,
  onCut,
  onRename,
  onDelete,
  onNewFolder,
  onNewFile,
  onPaste,
  onRefresh,
}: ExplorerContextMenu97Props) {
  const position: CSSProperties = { left: x, top: y };

  return <div
    className="win97-explorer-context-menu"
    style={position}
    role="menu"
    aria-label={node ? `${node.name} context menu` : 'Folder context menu'}
    onClick={event => event.stopPropagation()}
  >
    {node ? <>
      <button type="button" role="menuitem" onClick={() => onOpenNode(node)}>Open</button>
      <div className="win97-explorer-context-separator" role="separator" />
      <button type="button" role="menuitem" onClick={() => onCut(node)}>Cut</button>
      <button type="button" role="menuitem" onClick={() => onCopy(node)}>Copy</button>
      <div className="win97-explorer-context-separator" role="separator" />
      <button type="button" role="menuitem" onClick={() => onRename(node)}>Rename</button>
      <button type="button" role="menuitem" onClick={() => onDelete(node)}>Delete</button>
    </> : <>
      <button type="button" role="menuitem" onClick={onNewFolder}>New Folder</button>
      <button type="button" role="menuitem" onClick={onNewFile}>New Text Document</button>
      <div className="win97-explorer-context-separator" role="separator" />
      <button type="button" role="menuitem" disabled={!clipboardAvailable} onClick={onPaste}>Paste</button>
      <div className="win97-explorer-context-separator" role="separator" />
      <button type="button" role="menuitem" onClick={onRefresh}>Refresh</button>
    </>}
  </div>;
}
