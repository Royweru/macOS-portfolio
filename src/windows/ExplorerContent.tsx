'use client';

import { useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { copyNode, createFolderNode, createTextFileNode, deleteNodeToTrash, getCanonicalPath, getNode, listChildren, moveNode, renameNode } from '../features/filesystem/filesystem-service';
import type { VfsNode } from '../features/filesystem/filesystem-types';
import { VIRTUAL_NODE_IDS } from '../features/filesystem/virtual-paths';
import type { OpenTarget } from '../features/os/os-types';
import { targetForNode } from '../features/os/open-target';
import AppIcon from '../components/AppIcon';
import ExplorerContextMenu97 from './ExplorerContextMenu97';
import { getExplorerDetails97, getExplorerInitialView97, type ExplorerViewMode97 } from './explorer-presentation97';

const ROOT_ID: string = VIRTUAL_NODE_IDS.root;
const QUICK_LOCATIONS = [
  { id: ROOT_ID, label: 'My Computer (C:)', icon: 'computer' },
  { id: VIRTUAL_NODE_IDS.desktop, label: 'Desktop', icon: 'desktop' },
  { id: VIRTUAL_NODE_IDS.documents, label: 'My Documents', icon: 'folder' },
  { id: VIRTUAL_NODE_IDS.projects, label: 'Projects', icon: 'folder' },
  { id: VIRTUAL_NODE_IDS.videos, label: 'Videos', icon: 'video' },
  { id: VIRTUAL_NODE_IDS.pictures, label: 'Pictures', icon: 'paint' },
  { id: VIRTUAL_NODE_IDS.music, label: 'Music', icon: 'music' },
  { id: VIRTUAL_NODE_IDS.programFiles, label: 'Program Files', icon: 'folder' },
  { id: VIRTUAL_NODE_IDS.windows, label: 'Windows', icon: 'folder' },
];

type ClipboardItem = { nodeId: string; mode: 'copy' | 'cut' };

export default function ExplorerContent({ initialFolderId, onOpenTarget, onFolderChange }: {
  initialFolderId?: string;
  onOpenTarget?: (target: OpenTarget) => void;
  onFolderChange?: (folder: Pick<VfsNode, 'id' | 'name'>) => void;
}) {
  const [currentFolderId, setCurrentFolderId] = useState(initialFolderId ?? ROOT_ID);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ExplorerViewMode97>(() => getExplorerInitialView97(initialFolderId));
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node?: VfsNode } | null>(null);
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(null);
  const [nameDialog, setNameDialog] = useState<{ mode: 'folder' | 'file' | 'rename'; nodeId?: string; value: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<VfsNode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<'File' | 'Edit' | 'View' | 'Tools' | 'Help' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const isSourceDocumentsWindow = initialFolderId === VIRTUAL_NODE_IDS.documents;
  const contentRef = useRef<HTMLElement>(null);
  const nodes = useLiveQuery(() => listChildren(currentFolderId), [currentFolderId], []);
  const currentFolder = useLiveQuery(() => getNode(currentFolderId), [currentFolderId]);
  const currentPath = useLiveQuery(() => getCanonicalPath(currentFolderId), [currentFolderId]);
  const selectedNode = useLiveQuery(() => selectedId ? getNode(selectedId) : undefined, [selectedId]);
  const visibleNodes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const uniqueNodes = Array.from(new Map(nodes.map(node => [node.id, node])).values());
    return normalized ? uniqueNodes.filter(node => node.name.toLowerCase().includes(normalized)) : uniqueNodes;
  }, [nodes, query]);

  const navigateToFolder = (folder: Pick<VfsNode, 'id' | 'name'>) => {
    if (folder.id !== currentFolderId && folder.id === VIRTUAL_NODE_IDS.projects) setViewMode('details');
    setCurrentFolderId(folder.id);
    setQuery('');
    setSelectedId(null);
    onFolderChange?.(folder);
  };

  const navigateToFolderId = async (folderId: string) => {
    const folder = await getNode(folderId);
    if (folder?.kind === 'folder') navigateToFolder(folder);
  };

  const openNode = async (node: VfsNode) => {
    if (node.kind === 'folder') {
      navigateToFolder(node);
      return;
    }
    onOpenTarget?.(targetForNode(node));
  };

  const perform = async (operation: () => Promise<unknown>) => {
    setContextMenu(null);
    setErrorMessage(null);
    try { await operation(); } catch (error) { setErrorMessage(error instanceof Error ? error.message : 'Unable to complete this action'); }
  };
  const createItem = async (kind: 'folder' | 'file') => {
    setContextMenu(null);
    setNameDialog({ mode: kind, value: kind === 'folder' ? 'New folder' : 'New Text Document.txt' });
  };
  const submitName = async () => {
    if (!nameDialog?.value.trim()) return;
    const dialog = nameDialog;
    setNameDialog(null);
    if (dialog.mode === 'rename' && dialog.nodeId) await perform(() => renameNode(dialog.nodeId!, dialog.value));
    else if (dialog.mode === 'folder') await perform(() => createFolderNode(currentFolderId, dialog.value));
    else await perform(() => createTextFileNode(currentFolderId, dialog.value));
  };
  const paste = async () => {
    if (!clipboard) return;
    const item = clipboard;
    await perform(async () => { if (item.mode === 'copy') await copyNode(item.nodeId, currentFolderId); else await moveNode(item.nodeId, currentFolderId); setClipboard(null); });
  };
  const showContextMenu = (event: React.MouseEvent, node?: VfsNode) => {
    event.preventDefault();
    event.stopPropagation();
    const bounds = contentRef.current?.getBoundingClientRect();
    setContextMenu({ x: Math.max(8, Math.min(event.clientX, (bounds?.right ?? window.innerWidth) - 220)), y: Math.max(8, Math.min(event.clientY, (bounds?.bottom ?? window.innerHeight) - 270)), node });
    if (node) setSelectedId(node.id);
  };
  const handleContentKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') { setContextMenu(null); return; }
    if (!selectedNode) return;
    if (event.key === 'Enter') { event.preventDefault(); void openNode(selectedNode); }
    if (event.key === 'F2') { event.preventDefault(); setNameDialog({ mode: 'rename', nodeId: selectedNode.id, value: selectedNode.name }); }
    if (event.key === 'Delete') { event.preventDefault(); setDeleteDialog(selectedNode); }
    if (event.ctrlKey && event.key.toLowerCase() === 'c') { event.preventDefault(); setClipboard({ nodeId: selectedNode.id, mode: 'copy' }); }
    if (event.ctrlKey && event.key.toLowerCase() === 'x') { event.preventDefault(); setClipboard({ nodeId: selectedNode.id, mode: 'cut' }); }
    if (event.ctrlKey && event.key.toLowerCase() === 'v') { event.preventDefault(); void paste(); }
  };
  const runMenuAction = (action: string) => {
    setOpenMenu(null);
    if (action === 'new-folder') void createItem('folder');
    else if (action === 'new-file') void createItem('file');
    else if (action === 'rename' && selectedNode) setNameDialog({ mode: 'rename', nodeId: selectedNode.id, value: selectedNode.name });
    else if (action === 'delete' && selectedNode) setDeleteDialog(selectedNode);
    else if (action === 'cut' && selectedNode) setClipboard({ nodeId: selectedNode.id, mode: 'cut' });
    else if (action === 'copy' && selectedNode) setClipboard({ nodeId: selectedNode.id, mode: 'copy' });
    else if (action === 'paste') void paste();
    else if (action === 'search') setSearchOpen(value => !value);
    else if (action.startsWith('view:')) setViewMode(action.slice(5) as 'icons' | 'list' | 'details');
    else if (action === 'help') setShowHelp(true);
  };
  const iconFor = (node: VfsNode) => node.kind === 'folder' ? 'folder' : node.kind === 'shortcut' ? 'url' : node.mimeType.startsWith('video/') ? 'video' : node.mimeType.startsWith('audio/') ? 'music' : node.mimeType.startsWith('image/') ? 'paint' : 'document';
  const menuItem = 'win97-explorer-menu-item';
  const menus: Record<NonNullable<typeof openMenu>, Array<{ label: string; action?: string; disabled?: boolean; separator?: boolean }>> = {
    File: [
      { label: 'New Folder', action: 'new-folder' }, { label: 'New Text Document', action: 'new-file' },
      { label: '', separator: true }, { label: 'Rename', action: 'rename', disabled: !selectedNode }, { label: 'Delete', action: 'delete', disabled: !selectedNode },
    ],
    Edit: [
      { label: 'Cut', action: 'cut', disabled: !selectedNode }, { label: 'Copy', action: 'copy', disabled: !selectedNode },
      { label: 'Paste', action: 'paste', disabled: !clipboard }, { label: '', separator: true }, { label: 'Find', action: 'search' },
    ],
    View: [
      { label: 'Large Icons', action: 'view:icons' }, { label: 'List', action: 'view:list' }, { label: 'Details', action: 'view:details' },
      { label: '', separator: true }, { label: searchOpen ? 'Hide Find Bar' : 'Find', action: 'search' },
    ],
    Tools: [{ label: searchOpen ? 'Hide Find Bar' : 'Find...', action: 'search' }],
    Help: [{ label: 'About Weru Explorer', action: 'help' }],
  };

  return (
    <div className={`win97-explorer${isSourceDocumentsWindow ? ' win97-explorer-source-documents' : ''}`} onClick={() => { setContextMenu(null); if (openMenu) setOpenMenu(null); }}>
      <div className="win97-explorer-menu" role="menubar" aria-label="Explorer menu">
        {(['File', 'Edit', 'View', ...(currentFolderId === VIRTUAL_NODE_IDS.projects ? ['Tools' as const] : []), 'Help'] as const).map(label => <button key={label} type="button" aria-haspopup="menu" aria-expanded={openMenu === label} onClick={event => { event.stopPropagation(); setOpenMenu(openMenu === label ? null : label); }}>{label}</button>)}
        {openMenu && <div className="win97-explorer-menu-popup" role="menu" aria-label={`${openMenu} menu`} onClick={event => event.stopPropagation()}>{menus[openMenu].map((item, index) => item.separator ? <div key={`${openMenu}-separator-${index}`} className="win97-explorer-menu-separator" /> : <button key={`${openMenu}-${item.label}`} type="button" role="menuitem" disabled={item.disabled} className={menuItem} onClick={() => runMenuAction(item.action ?? '')}>{item.label}</button>)}</div>}
      </div>
      <div className="win97-explorer-toolbar" role="toolbar" aria-label="Explorer toolbar">
        <button type="button" onClick={() => void navigateToFolderId(currentFolder?.parentId ?? ROOT_ID)} disabled={!currentFolder?.parentId} aria-label="Back"><span className="win97-explorer-back">←</span><span>Back</span></button>
        <button type="button" disabled aria-label="Forward"><span>→</span><span>Forward</span></button>
        <button type="button" onClick={() => void navigateToFolderId(currentFolder?.parentId ?? ROOT_ID)} disabled={!currentFolder?.parentId} aria-label="Up"><span className="win97-explorer-up">↑</span><span>Up</span></button>
        <span className="win97-explorer-divider" aria-hidden="true" />
        <button type="button" disabled={!selectedNode} onClick={() => selectedNode && setClipboard({ nodeId: selectedNode.id, mode: 'cut' })} aria-label="Cut">Cut</button>
        <button type="button" disabled={!selectedNode} onClick={() => selectedNode && setClipboard({ nodeId: selectedNode.id, mode: 'copy' })} aria-label="Copy">Copy</button>
        <button type="button" disabled={!clipboard} onClick={() => void paste()} aria-label="Paste">Paste</button>
        <span className="win97-explorer-divider" aria-hidden="true" />
        <button type="button" onClick={() => setViewMode(viewMode === 'icons' ? 'list' : viewMode === 'list' ? 'details' : 'icons')} aria-label="Views"><span className="win97-explorer-views-icon">▦</span><span>Views</span></button>
      </div>
      <div className="win97-explorer-address-row"><span>Address</span><div className="win97-explorer-address"><AppIcon appId={currentFolder?.kind === 'folder' ? 'folder' : 'computer'} size={14} /><span aria-hidden="true">›</span><span className="truncate">{currentFolderId === ROOT_ID ? 'C:\\' : currentPath ?? currentFolder?.name ?? 'C:\\'}</span></div></div>
      {searchOpen && <label className="win97-explorer-search"><span>Find:</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Type a file name" aria-label="Find files in this folder" /></label>}
      <div className="win97-explorer-body">
        {!isSourceDocumentsWindow && <nav className="win97-explorer-tree" aria-label="Explorer folders"><div className="win97-explorer-tree-heading">Folders</div>{QUICK_LOCATIONS.map((location, index) => <button type="button" key={`${location.label}-${location.id}`} className={`win97-explorer-tree-item level-${index === 0 ? 0 : 1}${currentFolderId === location.id ? ' selected' : ''}`} onClick={() => { void navigateToFolderId(location.id); }}><span className="win97-explorer-tree-glyph" aria-hidden="true">{index === 0 ? '−' : '·'}</span><AppIcon appId={location.icon} size={16} /><span className="truncate">{location.label}</span></button>)}<button type="button" className={`win97-explorer-tree-item level-0${currentFolderId === VIRTUAL_NODE_IDS.recycled ? ' selected' : ''}`} onClick={() => { void navigateToFolderId(VIRTUAL_NODE_IDS.recycled); }}><span className="win97-explorer-tree-glyph">·</span><AppIcon appId="recycle-bin" size={16} /><span>Recycle Bin</span></button></nav>}
        <section ref={contentRef} className="win97-explorer-folder" aria-label="Folder contents" tabIndex={0} onKeyDown={handleContentKeyDown} onContextMenu={event => showContextMenu(event)}>
          <div className={`win97-explorer-file-view ${viewMode}`}>
            {viewMode === 'details' && <div className="win97-explorer-details-head"><span>Name</span><span>Size</span><span>Type</span><span>Date Modified</span></div>}
            {visibleNodes.map((node) => {
              const details = viewMode === 'details' ? getExplorerDetails97(node) : null;
              return <button
                type="button"
                key={node.id}
                className={`win97-explorer-file ${selectedId === node.id ? 'selected' : ''}`}
                onClick={(event) => { event.stopPropagation(); setSelectedId(node.id); }}
                onDoubleClick={(event) => { event.stopPropagation(); void openNode(node); }}
                onContextMenu={(event) => showContextMenu(event, node)}
              >
                {details ? <>
                  <span className="win97-explorer-file-name"><AppIcon appId={iconFor(node)} size={16} /><span>{node.name}</span></span>
                  <span>{details.size}</span><span>{details.type}</span><span>{details.modified}</span>
                </> : <>
                  <span className="text-[#3f4f5f]"><AppIcon appId={iconFor(node)} size={viewMode === 'icons' ? 32 : 22} /></span>
                  <span className="max-w-full truncate text-xs">{node.name}</span>
                </>}
              </button>;
            })}
          </div>
          {visibleNodes.length === 0 && <div className="win97-explorer-empty">This folder is empty.</div>}
        </section>
      </div>
      <div className="win97-explorer-status"><span>{visibleNodes.length} object(s){selectedNode ? ` — ${selectedNode.name}` : ''}</span><span>{isSourceDocumentsWindow ? '14.2 KB (Free: 1.44 MB)' : `${currentPath ?? 'C:\\'} · ${visibleNodes.length} items`}</span></div>
      {errorMessage && <div role="alert" className="win97-explorer-error"><span>{errorMessage}</span><button type="button" onClick={() => setErrorMessage(null)}>Dismiss</button></div>}
      {contextMenu && <ExplorerContextMenu97
        x={contextMenu.x}
        y={contextMenu.y}
        node={contextMenu.node}
        clipboardAvailable={Boolean(clipboard)}
        onOpenNode={node => { setContextMenu(null); void openNode(node); }}
        onCopy={node => { setClipboard({ nodeId: node.id, mode: 'copy' }); setContextMenu(null); }}
        onCut={node => { setClipboard({ nodeId: node.id, mode: 'cut' }); setContextMenu(null); }}
        onRename={node => { setContextMenu(null); setNameDialog({ mode: 'rename', nodeId: node.id, value: node.name }); }}
        onDelete={node => { setContextMenu(null); setDeleteDialog(node); }}
        onNewFolder={() => void createItem('folder')}
        onNewFile={() => void createItem('file')}
        onPaste={() => void paste()}
        onRefresh={() => setContextMenu(null)}
      />}
      {showHelp && <div className="win97-explorer-help" role="dialog" aria-modal="true" aria-label="About Weru Explorer"><div><b>About Weru Explorer</b><button type="button" aria-label="Close About Weru Explorer" onClick={() => setShowHelp(false)}>×</button></div><p>Weru 97 File Explorer</p><p>Browse folders and open portfolio files in their matching classic applications.</p><footer><button type="button" onClick={() => setShowHelp(false)}>OK</button></footer></div>}
      {nameDialog && <div role="dialog" aria-modal="true" aria-label="Name item" className="win97-explorer-dialog-shade" onClick={() => setNameDialog(null)}><form className="win97-explorer-dialog" onClick={event => event.stopPropagation()} onSubmit={event => { event.preventDefault(); void submitName(); }}><h3>{nameDialog.mode === 'rename' ? 'Rename item' : nameDialog.mode === 'folder' ? 'Create folder' : 'Create text document'}</h3><label className="win97-explorer-dialog-field">Name<input autoFocus value={nameDialog.value} onChange={event => setNameDialog({ ...nameDialog, value: event.target.value })} /></label><div className="win97-explorer-dialog-actions"><button type="button" onClick={() => setNameDialog(null)}>Cancel</button><button type="submit">Save</button></div></form></div>}
      {deleteDialog && <div role="dialog" aria-modal="true" aria-label="Confirm delete" className="win97-explorer-dialog-shade" onClick={() => setDeleteDialog(null)}><div className="win97-explorer-dialog" onClick={event => event.stopPropagation()}><h3>Move to Recycle Bin?</h3><p>{deleteDialog.name} will remain recoverable until the Recycle Bin is emptied.</p><div className="win97-explorer-dialog-actions"><button type="button" onClick={() => setDeleteDialog(null)}>Cancel</button><button type="button" onClick={() => { const node = deleteDialog; setDeleteDialog(null); void perform(() => deleteNodeToTrash(node.id)); }}>Move to Recycle Bin</button></div></div></div>}
    </div>
  );
}
