'use client';

import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { cacheTextAssetContent, createTextFileNode, getMarkdownLinkedTextFile, getNode, updateTextFile } from '../features/filesystem/filesystem-service';
import type { VfsNode } from '../features/filesystem/filesystem-types';
import MarkdownPreview97 from '../apps/notepad/MarkdownPreview97';
import type { OpenTarget } from '../features/os/os-types';
import { targetForNode } from '../features/os/open-target';
import { getNotepadCaret97, type NotepadCaret97 } from './notepad-caret97';
import { findNextTextMatch97, getNotepadMenuFocusIndex97, getNotepadMenuItems97, getSaveAsCopyName97, type NotepadMenu97, type NotepadMenuCommand97 } from './notepad-menu97';

export default function NotepadContent({ fileId, onOpenTarget, onSaveAsDocument }: { fileId?: string; onOpenTarget?: (target: OpenTarget) => void; onSaveAsDocument?: (fileId: string, title: string) => void }) {
  const node = useLiveQuery(() => fileId ? getNode(fileId) : undefined, [fileId]);

  if (!fileId) return <div className="flex h-full items-center justify-center text-xs font-mono text-gray-500 bg-white">Select a text file to open in Notepad.</div>;
  if (node === undefined) return <div className="flex h-full items-center justify-center text-xs font-mono text-gray-500 bg-white">Loading document…</div>;
  if (!node) return <div className="flex h-full items-center justify-center text-xs font-mono text-red-700 bg-white">This document is no longer available.</div>;

  return <NotepadEditor key={node.id} node={node} onOpenTarget={onOpenTarget} onSaveAsDocument={onSaveAsDocument} />;
}

function NotepadEditor({ node, onOpenTarget, onSaveAsDocument }: { node: VfsNode; onOpenTarget?: (target: OpenTarget) => void; onSaveAsDocument?: (fileId: string, title: string) => void }) {
  const isMarkdown = node.mimeType === 'text/markdown' || node.name.toLowerCase().endsWith('.md');
  const [draft, setDraft] = useState(node.content ?? '');
  const [dirty, setDirty] = useState(false);
  const [caret, setCaret] = useState<NotepadCaret97>({ line: 1, column: 1 });
  const [status, setStatus] = useState(node.isReadOnly ? 'Read-only' : 'Ready');
  const [sourceLoading, setSourceLoading] = useState(Boolean(node.contentUrl && !node.content));
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [preview, setPreview] = useState(isMarkdown);
  const [activeMenu, setActiveMenu] = useState<NotepadMenu97 | null>(null);
  const [saveAsOpen, setSaveAsOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [findTerm, setFindTerm] = useState('');
  const [saveAsName, setSaveAsName] = useState(getSaveAsCopyName97(node.name, isMarkdown));
  const loadedAssetUrl = useRef<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const readOnly = Boolean(node.isReadOnly || node.isSystem);
  const selectionStart = editorRef.current?.selectionStart ?? 0;
  const selectionEnd = editorRef.current?.selectionEnd ?? 0;
  const hasSelection = selectionEnd > selectionStart;

  useEffect(() => {
    if (!activeMenu) return;
    const dismissOutside = (event: PointerEvent) => {
      if (!menuBarRef.current?.contains(event.target as Node)) setActiveMenu(null);
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setActiveMenu(null);
        event.stopPropagation();
        requestAnimationFrame(() => menuBarRef.current?.querySelector<HTMLButtonElement>(`[data-notepad-menu-button="${activeMenu}"]`)?.focus());
      }
    };
    window.addEventListener('pointerdown', dismissOutside);
    window.addEventListener('keydown', dismissEscape, true);
    return () => {
      window.removeEventListener('pointerdown', dismissOutside);
      window.removeEventListener('keydown', dismissEscape, true);
    };
  }, [activeMenu]);
  const openLinkedDocument = async (href: string) => {
    const linkedNode = await getMarkdownLinkedTextFile(node.id, href);
    if (!linkedNode) {
      setStatus(`Linked text file not found: ${href}`);
      return;
    }
    onOpenTarget?.(targetForNode(linkedNode));
  };

  useEffect(() => {
    if (!node.contentUrl) {
      setDraft(node.content ?? '');
      setSourceLoading(false);
      setSourceError(null);
      return;
    }
    if (node.content && loadedAssetUrl.current === node.contentUrl) {
      setDraft(node.content);
      setSourceLoading(false);
      setSourceError(null);
      setStatus(readOnly ? 'Read-only' : 'Ready');
      return;
    }
    const controller = new AbortController();
    setDraft(node.content ?? '');
    setSourceLoading(true);
    setSourceError(null);
    setStatus('Loading document…');
    void (async () => {
      try {
        const url = new URL(node.contentUrl!, window.location.origin);
        const pathname = url.pathname.toLowerCase();
        const hasExpectedExtension = node.mimeType === 'text/markdown'
          ? pathname.endsWith('.md')
          : node.mimeType === 'text/plain' && pathname.endsWith('.txt');
        if (url.origin !== window.location.origin || !hasExpectedExtension) {
          throw new Error('Document must be a same-origin text asset with a matching file extension.');
        }
        const response = await fetch(url, { signal: controller.signal, credentials: 'same-origin' });
        if (!response.ok) throw new Error(`${node.name} could not be loaded (${response.status}).`);
        const content = await response.text();
        if (controller.signal.aborted) return;
        loadedAssetUrl.current = node.contentUrl!;
        setDraft(content);
        setStatus(readOnly ? 'Read-only' : 'Ready');
        await cacheTextAssetContent(node.id, content);
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : `${node.name} could not be loaded.`;
        setSourceError(message);
        setStatus('Read error');
      } finally {
        if (!controller.signal.aborted) setSourceLoading(false);
      }
    })();
    return () => controller.abort();
  }, [node.content, node.contentUrl, node.id, node.mimeType, node.name, readOnly]);

  const save = async () => {
    if (readOnly) return;
    try {
      await updateTextFile(node.id, draft);
      setDirty(false);
      setStatus('Saved');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save');
    }
  };

  const saveAs = async () => {
    const name = saveAsName.trim();
    if (!name || !node.parentId) return;
    try {
      const created = await createTextFileNode(node.parentId, name, draft);
      setSaveAsOpen(false);
      if (onSaveAsDocument) {
        onSaveAsDocument(created.id, created.name);
        setDirty(false);
        setStatus(`Saved as ${created.name}`);
      } else {
        setStatus(`Saved copy as ${created.name}`);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save');
    }
  };

  const setEditorText = (next: string, caretPosition: number) => {
    setDraft(next);
    setDirty(true);
    setStatus('Modified');
    setCaret(getNotepadCaret97(next, caretPosition));
    requestAnimationFrame(() => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.focus();
      editor.setSelectionRange(caretPosition, caretPosition);
    });
  };

  const selectAll = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    editor.select();
  };

  const copySelection = async (remove = false) => {
    const editor = editorRef.current;
    if (!editor || editor.selectionStart === editor.selectionEnd) return;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    try {
      await navigator.clipboard.writeText(editor.value.slice(start, end));
      if (remove) setEditorText(`${editor.value.slice(0, start)}${editor.value.slice(end)}`, start);
      setStatus(remove ? 'Cut to clipboard' : 'Copied to clipboard');
    } catch {
      setStatus('Clipboard access is unavailable; use the keyboard shortcut instead.');
    }
  };

  const pasteClipboard = async () => {
    const editor = editorRef.current;
    if (!editor || readOnly) return;
    try {
      const pasted = await navigator.clipboard.readText();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      setEditorText(`${editor.value.slice(0, start)}${pasted}${editor.value.slice(end)}`, start + pasted.length);
    } catch {
      setStatus('Clipboard access is unavailable; use the keyboard shortcut instead.');
    }
  };

  const findNext = () => {
    const editor = editorRef.current;
    const text = editor?.value ?? draft;
    const from = editor ? Math.max(editor.selectionStart, editor.selectionEnd) : 0;
    const index = findNextTextMatch97(text, findTerm, from);
    if (index < 0) {
      setStatus('String not found');
      return;
    }
    setStatus(`Found at line ${getNotepadCaret97(text, index).line}`);
    if (findOpen) setFindOpen(false);
    if (editor) {
      editor.focus();
      editor.setSelectionRange(index, index + findTerm.trim().length);
      setCaret(getNotepadCaret97(text, index));
    }
  };

  const runMenuCommand = (command: NotepadMenuCommand97) => {
    setActiveMenu(null);
    if (command === 'save') void save();
    else if (command === 'save-as') setSaveAsOpen(true);
    else if (command === 'cut') void copySelection(true);
    else if (command === 'copy') void copySelection();
    else if (command === 'paste') void pasteClipboard();
    else if (command === 'select-all') selectAll();
    else if (command === 'find') setFindOpen(true);
    else if (command === 'find-next') findNext();
    else if (command === 'help-topics' || command === 'about') setHelpOpen(true);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#C0C0C0] text-black font-sans text-xs select-none" data-window-dirty={dirty ? 'true' : 'false'}>
      {/* Classic Menu Bar */}
      <div ref={menuBarRef} className="win97-notepad-menubar" role="menubar" aria-label="Notepad menus">
        {(['File', 'Edit', 'Search', 'Help'] as const).map((menu, menuIndex, menus) => <div className="win97-notepad-menu-wrap" key={menu}>
          <button type="button" role="menuitem" data-notepad-menu-button={menu} aria-haspopup="menu" aria-expanded={activeMenu === menu} onClick={() => setActiveMenu(current => current === menu ? null : menu)} onKeyDown={event => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveMenu(menu);
              requestAnimationFrame(() => menuBarRef.current?.querySelector<HTMLButtonElement>(`[data-notepad-menu="${menu}"] button[role="menuitem"]:not(:disabled)`)?.focus());
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
              const direction = event.key === 'ArrowRight' ? 1 : -1;
              const nextMenu = menus[(menuIndex + direction + menus.length) % menus.length];
              menuBarRef.current?.querySelector<HTMLButtonElement>(`[data-notepad-menu-button="${nextMenu}"]`)?.focus();
            }
          }} className="win97-notepad-menu-button"><span className="underline">{menu[0]}</span>{menu.slice(1)}</button>
          {activeMenu === menu && <div className="win97-notepad-menu" role="menu" data-notepad-menu={menu} aria-label={`${menu} menu`} onKeyDown={event => {
            const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]:not(:disabled)'));
            const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
            const nextIndex = getNotepadMenuFocusIndex97(items.length, currentIndex, event.key);
            if (nextIndex !== currentIndex && nextIndex >= 0) {
              event.preventDefault();
              items[nextIndex]?.focus();
            }
          }}>
            {getNotepadMenuItems97(menu, {
              readOnly,
              dirty,
              canSaveAs: Boolean(node.parentId) && !sourceLoading && !sourceError,
              hasSelection,
              canEdit: Boolean(editorRef.current) && !preview,
              hasFindTerm: Boolean(findTerm.trim()),
            }).map(item => <div key={item.id}>
              {item.separatorBefore && <div className="win97-notepad-menu-separator" role="separator" />}
              <button type="button" role="menuitem" disabled={item.disabled} onClick={() => runMenuCommand(item.id)}>{item.label}</button>
            </div>)}
          </div>}
        </div>)}
        {isMarkdown && <button type="button" aria-pressed={preview} onClick={() => setPreview(value => !value)} className={`px-1 py-0.5 hover:bg-[#000080] hover:text-white${preview ? ' bg-[#000080] text-white' : ''}`}>{preview ? 'Source' : 'Preview'}</button>}
      </div>

      {/* Editor Content Area */}
      {preview && isMarkdown ? <MarkdownPreview97 source={draft} onOpenDocument={href => { void openLinkedDocument(href); }} /> : <textarea
        ref={editorRef}
        value={draft}
        readOnly={readOnly}
        onChange={event => {
          setDraft(event.target.value);
          setDirty(true);
          setStatus('Modified');
          setCaret(getNotepadCaret97(event.currentTarget.value, event.currentTarget.selectionStart));
        }}
        onSelect={event => setCaret(getNotepadCaret97(event.currentTarget.value, event.currentTarget.selectionStart))}
        onKeyUp={event => setCaret(getNotepadCaret97(event.currentTarget.value, event.currentTarget.selectionStart))}
        onClick={event => setCaret(getNotepadCaret97(event.currentTarget.value, event.currentTarget.selectionStart))}
        onKeyDown={event => {
          if (!(event.ctrlKey || event.metaKey)) return;
          if (event.key.toLowerCase() === 's' && event.shiftKey) { event.preventDefault(); setSaveAsOpen(true); }
          else if (event.key.toLowerCase() === 's') { event.preventDefault(); void save(); }
          else if (event.key.toLowerCase() === 'f') { event.preventDefault(); setFindOpen(true); }
        }}
        className="min-h-0 flex-1 resize-none border-0 bg-white p-3 font-mono text-base leading-6 text-black outline-none retro-sunken selection:bg-[#000080] selection:text-white cursor-text"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
        aria-label={`${node.name} contents`}
      />}
      {sourceLoading && <div className="win97-notepad-loading" role="status">Loading {node.name}…</div>}
      {sourceError && <div className="win97-notepad-source-error" role="alert">{sourceError}</div>}

      {/* Retro Status Bar */}
      <div className="h-5 bg-[#C0C0C0] px-1 py-0.5 flex items-center gap-1 text-[10px] border-t border-[#808080]">
        <div className="retro-sunken px-1.5 flex-1 h-full flex items-center justify-between">
          <span>{status}</span>
          <span>{node.name}{dirty ? ' *' : ''}</span>
        </div>
        <div className="retro-sunken px-1.5 w-24 h-full flex items-center justify-center font-mono">
          <span aria-label={`Line ${caret.line}, column ${caret.column}`}>Ln {caret.line}, Col {caret.column}</span>
        </div>
      </div>

      {/* Save As Dialog */}
      {saveAsOpen && (
        <div role="dialog" aria-modal="true" aria-label="Save document as" className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 p-4">
          <form className="w-80 bg-[#C0C0C0] retro-raised p-3 shadow-2xl flex flex-col gap-2" onSubmit={event => { event.preventDefault(); void saveAs(); }}>
            <div className="bg-[#000080] text-white px-2 py-0.5 font-bold text-xs flex justify-between items-center">
              <span>Save As</span>
              <button type="button" onClick={() => setSaveAsOpen(false)} className="w-4 h-3.5 bg-[#C0C0C0] text-black flex items-center justify-center retro-raised text-[10px]">×</button>
            </div>
            <label className="text-xs">
              File name:
              <input
                autoFocus
                value={saveAsName}
                onChange={event => setSaveAsName(event.target.value)}
                className="mt-1 w-full bg-white border border-[#808080] retro-sunken px-1.5 py-1 text-xs outline-none"
              />
            </label>
            <div className="flex justify-end gap-2 mt-2">
              <button type="submit" className="px-3 py-1 bg-[#C0C0C0] retro-raised text-xs active:translate-x-[1px] active:translate-y-[1px]">Save</button>
              <button type="button" onClick={() => setSaveAsOpen(false)} className="px-3 py-1 bg-[#C0C0C0] retro-raised text-xs active:translate-x-[1px] active:translate-y-[1px]">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Find Dialog */}
      {findOpen && (
        <div role="dialog" aria-modal="true" aria-label="Find text" className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 p-4">
          <form className="w-80 bg-[#C0C0C0] retro-raised p-3 shadow-2xl flex flex-col gap-2" onSubmit={event => { event.preventDefault(); findNext(); }}>
            <div className="bg-[#000080] text-white px-2 py-0.5 font-bold text-xs flex justify-between items-center">
              <span>Find</span>
              <button type="button" onClick={() => setFindOpen(false)} className="w-4 h-3.5 bg-[#C0C0C0] text-black flex items-center justify-center retro-raised text-[10px]">×</button>
            </div>
            <label className="text-xs">
              Find what:
              <input
                autoFocus
                value={findTerm}
                onChange={event => setFindTerm(event.target.value)}
                className="mt-1 w-full bg-white border border-[#808080] retro-sunken px-1.5 py-1 text-xs outline-none"
              />
            </label>
            <div className="flex justify-end gap-2 mt-2">
              <button type="submit" className="px-3 py-1 bg-[#C0C0C0] retro-raised text-xs active:translate-x-[1px] active:translate-y-[1px]">Find Next</button>
              <button type="button" onClick={() => setFindOpen(false)} className="px-3 py-1 bg-[#C0C0C0] retro-raised text-xs active:translate-x-[1px] active:translate-y-[1px]">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {helpOpen && <div role="dialog" aria-modal="true" aria-label="Notepad Help" className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 p-4">
        <div className="win97-notepad-help">
          <div className="win97-notepad-help-title"><strong>Notepad Help</strong><button type="button" aria-label="Close help" onClick={() => setHelpOpen(false)}>×</button></div>
          <p>Use File to save your document, Edit to work with selected text, and Search to find text in the current document.</p>
          <div><button type="button" className="win95-button" onClick={() => setHelpOpen(false)}>OK</button></div>
        </div>
      </div>}
    </div>
  );
}
