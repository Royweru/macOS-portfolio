'use client';

import { useMemo, useRef, useState } from 'react';
import { ChevronRight, ClipboardPaste, Copy, ExternalLink, FolderPlus, Pencil, Plus, RefreshCw, Scissors, Trash } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { copyNode, createFolderNode, createTextFileNode, deleteNodeToTrash, getCanonicalPath, getNode, listChildren, moveNode, renameNode } from '../features/filesystem/filesystem-service';
import type { VfsNode } from '../features/filesystem/filesystem-types';
import { VIRTUAL_NODE_IDS } from '../features/filesystem/virtual-paths';
import type { OpenTarget } from '../features/os/os-types';
import { targetForNode } from '../features/os/open-target';
import AppIcon from '../components/AppIcon';

const ROOT_ID: string = VIRTUAL_NODE_IDS.root;
const QUICK_LOCATIONS = [
  { id: ROOT_ID, label: 'My Computer', icon: 'computer' },
  { id: VIRTUAL_NODE_IDS.desktop, label: 'Desktop', icon: 'computer' },
  { id: VIRTUAL_NODE_IDS.documents, label: 'My Documents', icon: 'folder' },
  { id: VIRTUAL_NODE_IDS.downloads, label: 'Downloads', icon: 'folder' },
  { id: VIRTUAL_NODE_IDS.projects, label: 'Projects', icon: 'folder' },
  { id: VIRTUAL_NODE_IDS.pictures, label: 'Pictures', icon: 'paint' },
  { id: VIRTUAL_NODE_IDS.videos, label: 'Videos', icon: 'video' },
  { id: VIRTUAL_NODE_IDS.music, label: 'Music', icon: 'music' },
];

type ClipboardItem = { nodeId: string; mode: 'copy' | 'cut' };

export default function ExplorerContent({ initialFolderId, onOpenTarget }: { initialFolderId?: string; onOpenTarget?: (target: OpenTarget) => void }) {
  const [currentFolderId, setCurrentFolderId] = useState(initialFolderId ?? ROOT_ID);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'icons' | 'list' | 'details'>('icons');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node?: VfsNode } | null>(null);
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(null);
  const [nameDialog, setNameDialog] = useState<{ mode: 'folder' | 'file' | 'rename'; nodeId?: string; value: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<VfsNode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<'File' | 'Edit' | 'View' | 'Help' | null>(null);
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

  const openNode = async (node: VfsNode) => {
    if (node.kind === 'folder') {
      setCurrentFolderId(node.id);
      setQuery('');
      setSelectedId(null);
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
    Help: [{ label: 'About Weru Explorer', action: 'help' }],
  };

  return (
    <div className={`win97-explorer${isSourceDocumentsWindow ? ' win97-explorer-source-documents' : ''}`} onClick={() => { setContextMenu(null); if (openMenu) setOpenMenu(null); }}>
      <div className="win97-explorer-menu" role="menubar" aria-label="Explorer menu">
        {(['File', 'Edit', 'View', 'Help'] as const).map(label => <button key={label} type="button" aria-haspopup="menu" aria-expanded={openMenu === label} onClick={event => { event.stopPropagation(); setOpenMenu(openMenu === label ? null : label); }}>{label}</button>)}
        {openMenu && <div className="win97-explorer-menu-popup" role="menu" aria-label={`${openMenu} menu`} onClick={event => event.stopPropagation()}>{menus[openMenu].map((item, index) => item.separator ? <div key={`${openMenu}-separator-${index}`} className="win97-explorer-menu-separator" /> : <button key={`${openMenu}-${item.label}`} type="button" role="menuitem" disabled={item.disabled} className={menuItem} onClick={() => runMenuAction(item.action ?? '')}>{item.label}</button>)}</div>}
      </div>
      <div className="win97-explorer-toolbar" role="toolbar" aria-label="Explorer toolbar">
        <button type="button" onClick={() => setCurrentFolderId(currentFolder?.parentId ?? ROOT_ID)} disabled={!currentFolder?.parentId} aria-label="Back"><span className="win97-explorer-back">←</span><span>Back</span></button>
        <button type="button" disabled aria-label="Forward"><span>→</span><span>Forward</span></button>
        <button type="button" onClick={() => setCurrentFolderId(currentFolder?.parentId ?? ROOT_ID)} disabled={!currentFolder?.parentId} aria-label="Up"><span className="win97-explorer-up">↑</span><span>Up</span></button>
        <span className="win97-explorer-divider" aria-hidden="true" />
        <button type="button" disabled={!selectedNode} onClick={() => selectedNode && setClipboard({ nodeId: selectedNode.id, mode: 'cut' })} aria-label="Cut">Cut</button>
        <button type="button" disabled={!selectedNode} onClick={() => selectedNode && setClipboard({ nodeId: selectedNode.id, mode: 'copy' })} aria-label="Copy">Copy</button>
        <button type="button" disabled={!clipboard} onClick={() => void paste()} aria-label="Paste">Paste</button>
        <span className="win97-explorer-divider" aria-hidden="true" />
        <button type="button" onClick={() => setViewMode(viewMode === 'icons' ? 'list' : viewMode === 'list' ? 'details' : 'icons')} aria-label="Views"><span className="win97-explorer-views-icon">▦</span><span>Views</span></button>
      </div>
      <div className="win97-explorer-address-row"><span>Address</span><div className="win97-explorer-address"><AppIcon appId={currentFolder?.kind === 'folder' ? 'folder' : 'computer'} size={14} /><ChevronRight size={11} aria-hidden="true" /><span className="truncate">{currentFolderId === ROOT_ID ? 'C:\\' : currentPath ?? currentFolder?.name ?? 'C:\\'}</span></div></div>
      {searchOpen && <label className="win97-explorer-search"><span>Find:</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Type a file name" aria-label="Find files in this folder" /></label>}
      <div className="win97-explorer-body">
        {!isSourceDocumentsWindow && <nav className="win97-explorer-tree" aria-label="Explorer folders"><div className="win97-explorer-tree-heading">Folders</div>{QUICK_LOCATIONS.map((location, index) => <button type="button" key={`${location.label}-${location.id}`} className={`win97-explorer-tree-item level-${index < 3 ? 0 : 1}${currentFolderId === location.id ? ' selected' : ''}`} onClick={() => { setCurrentFolderId(location.id); setSelectedId(null); }}><span className="win97-explorer-tree-glyph" aria-hidden="true">{index === 0 ? '−' : '·'}</span><AppIcon appId={location.icon} size={16} /><span className="truncate">{location.label}</span></button>)}<button type="button" className={`win97-explorer-tree-item level-1${currentFolderId === VIRTUAL_NODE_IDS.windows ? ' selected' : ''}`} onClick={() => setCurrentFolderId(VIRTUAL_NODE_IDS.windows)}><span className="win97-explorer-tree-glyph">·</span><AppIcon appId="computer" size={16} /><span>Windows</span></button><button type="button" className={`win97-explorer-tree-item level-0${currentFolderId === VIRTUAL_NODE_IDS.recycled ? ' selected' : ''}`} onClick={() => setCurrentFolderId(VIRTUAL_NODE_IDS.recycled)}><span className="win97-explorer-tree-glyph">·</span><AppIcon appId="recycle-bin" size={16} /><span>Recycle Bin</span></button></nav>}
        <section ref={contentRef} className="win97-explorer-folder" aria-label="Folder contents" tabIndex={0} onKeyDown={handleContentKeyDown} onContextMenu={event => showContextMenu(event)}>
          <div className={`win97-explorer-file-view ${viewMode}`}>
            {viewMode === 'details' && <div className="win97-explorer-details-head"><span>Name</span><span>Size</span><span>Type</span><span>Date Modified</span></div>}
            {visibleNodes.map((node) => (
              <button
                type="button"
                key={node.id}
                className={`win97-explorer-file ${selectedId === node.id ? 'selected' : ''}`}
                onClick={(event) => { event.stopPropagation(); setSelectedId(node.id); }}
                onDoubleClick={(event) => { event.stopPropagation(); void openNode(node); }}
                onContextMenu={(event) => showContextMenu(event, node)}
              >
                <span className="text-[#3f4f5f]"><AppIcon appId={iconFor(node)} size={viewMode === 'icons' ? 32 : 22} /></span>
                <span className="max-w-full truncate text-xs">{node.name}</span>
                {viewMode === 'details' && <><span>{node.mimeType}</span><span>{node.size ?? 0} B</span></>}
              </button>
            ))}
          </div>
          {visibleNodes.length === 0 && <div className="flex h-full min-h-48 items-center justify-center text-sm text-slate-500">This folder is empty.</div>}
        </section>
      </div>
      <div className="win97-explorer-status"><span>{visibleNodes.length} object(s){selectedNode ? ` — ${selectedNode.name}` : ''}</span><span>{isSourceDocumentsWindow ? '14.2 KB (Free: 1.44 MB)' : `${currentPath ?? 'C:\\'} · ${visibleNodes.length} items`}</span></div>
      {errorMessage && <div role="alert" className="absolute bottom-10 left-4 right-4 z-[90] flex items-center justify-between border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 shadow"><span>{errorMessage}</span><button type="button" className="font-semibold" onClick={() => setErrorMessage(null)}>Dismiss</button></div>}
      {contextMenu && <div role="menu" className="fixed z-[100] min-w-52 border border-slate-300 bg-white py-1 text-sm shadow-lg" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={event => event.stopPropagation()}>{contextMenu.node ? <><button type="button" className={menuItem} onClick={() => { setContextMenu(null); void openNode(contextMenu.node!); }}><ExternalLink size={14} />Open</button><button type="button" className={menuItem} onClick={() => { setClipboard({ nodeId: contextMenu.node!.id, mode: 'copy' }); setContextMenu(null); }}><Copy size={14} />Copy</button><button type="button" className={menuItem} onClick={() => { setClipboard({ nodeId: contextMenu.node!.id, mode: 'cut' }); setContextMenu(null); }}><Scissors size={14} />Cut</button><button type="button" className={menuItem} onClick={() => { setContextMenu(null); setNameDialog({ mode: 'rename', nodeId: contextMenu.node!.id, value: contextMenu.node!.name }); }}><Pencil size={14} />Rename</button><button type="button" className={`${menuItem} text-red-700`} onClick={() => { setContextMenu(null); setDeleteDialog(contextMenu.node!); }}><Trash size={14} />Delete</button></> : <><button type="button" className={menuItem} onClick={() => void createItem('folder')}><FolderPlus size={14} />New folder</button><button type="button" className={menuItem} onClick={() => void createItem('file')}><Plus size={14} />New text document</button><button type="button" className={menuItem} disabled={!clipboard} onClick={() => void paste()}><ClipboardPaste size={14} />Paste</button><button type="button" className={menuItem} onClick={() => setContextMenu(null)}><RefreshCw size={14} />Refresh</button></>}</div>}
      {showHelp && <div className="win97-explorer-help" role="dialog" aria-modal="true" aria-label="About Weru Explorer"><div><b>About Weru Explorer</b><button type="button" aria-label="Close About Weru Explorer" onClick={() => setShowHelp(false)}>×</button></div><p>Weru 97 File Explorer</p><p>Browse folders and open portfolio files in their matching classic applications.</p><footer><button type="button" onClick={() => setShowHelp(false)}>OK</button></footer></div>}
      {nameDialog && <div role="dialog" aria-modal="true" aria-label="Name item" className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 p-4" onClick={() => setNameDialog(null)}><form className="w-full max-w-sm border border-slate-300 bg-white p-4 shadow-xl" onClick={event => event.stopPropagation()} onSubmit={event => { event.preventDefault(); void submitName(); }}><h3 className="text-sm font-semibold text-slate-900">{nameDialog.mode === 'rename' ? 'Rename item' : nameDialog.mode === 'folder' ? 'Create folder' : 'Create text document'}</h3><label className="mt-3 block text-xs text-slate-600">Name<input autoFocus value={nameDialog.value} onChange={event => setNameDialog({ ...nameDialog, value: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-[#0067c0]" /></label><div className="mt-4 flex justify-end gap-2"><button type="button" className="border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100" onClick={() => setNameDialog(null)}>Cancel</button><button type="submit" className="bg-[#0067c0] px-3 py-1.5 text-xs text-white hover:bg-[#005a9e]">Save</button></div></form></div>}
      {deleteDialog && <div role="dialog" aria-modal="true" aria-label="Confirm delete" className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 p-4" onClick={() => setDeleteDialog(null)}><div className="w-full max-w-sm border border-slate-300 bg-white p-4 shadow-xl" onClick={event => event.stopPropagation()}><h3 className="text-sm font-semibold text-slate-900">Move to Recycle Bin?</h3><p className="mt-2 text-sm text-slate-600">{deleteDialog.name} will remain recoverable until the Recycle Bin is emptied.</p><div className="mt-4 flex justify-end gap-2"><button type="button" className="border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100" onClick={() => setDeleteDialog(null)}>Cancel</button><button type="button" className="bg-red-700 px-3 py-1.5 text-xs text-white hover:bg-red-800" onClick={() => { const node = deleteDialog; setDeleteDialog(null); void perform(() => deleteNodeToTrash(node.id)); }}>Move to Recycle Bin</button></div></div></div>}
    </div>
  );
}
