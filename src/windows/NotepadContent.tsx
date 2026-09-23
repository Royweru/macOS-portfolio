'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { createTextFileNode, getNode, updateTextFile } from '../features/filesystem/filesystem-service';
import type { VfsNode } from '../features/filesystem/filesystem-types';

export default function NotepadContent({ fileId }: { fileId?: string }) {
  const node = useLiveQuery(() => fileId ? getNode(fileId) : undefined, [fileId]);

  if (!fileId) return <div className="flex h-full items-center justify-center text-xs font-mono text-gray-500 bg-white">Select a text file to open in Notepad.</div>;
  if (node === undefined) return <div className="flex h-full items-center justify-center text-xs font-mono text-gray-500 bg-white">Loading document…</div>;
  if (!node) return <div className="flex h-full items-center justify-center text-xs font-mono text-red-700 bg-white">This document is no longer available.</div>;

  return <NotepadEditor key={node.id} node={node} />;
}

function NotepadEditor({ node }: { node: VfsNode }) {
  const [draft, setDraft] = useState(node.content ?? '');
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState(node.isReadOnly ? 'Read-only' : 'Ready');
  const [saveAsOpen, setSaveAsOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [findTerm, setFindTerm] = useState('');
  const [saveAsName, setSaveAsName] = useState(`${node.name.replace(/\.[^.]+$/, '')} copy.txt`);
  const readOnly = Boolean(node.isReadOnly || node.isSystem);

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
      setStatus(`Saved copy as ${created.name}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save');
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#C0C0C0] text-black font-sans text-xs select-none" data-window-dirty={dirty ? 'true' : 'false'}>
      {/* Classic Menu Bar */}
      <div className="flex h-5 items-center gap-2 border-b border-[#808080] bg-[#C0C0C0] px-1 text-[11px]">
        <button type="button" onClick={() => void save()} disabled={readOnly || !dirty} className="px-1 py-0.5 hover:bg-[#000080] hover:text-white disabled:opacity-50"><span className="underline">F</span>ile</button>
        <button type="button" onClick={() => setSaveAsOpen(true)} className="px-1 py-0.5 hover:bg-[#000080] hover:text-white"><span className="underline">E</span>dit</button>
        <button type="button" onClick={() => setFindOpen(true)} className="px-1 py-0.5 hover:bg-[#000080] hover:text-white"><span className="underline">S</span>earch</button>
        <button type="button" className="px-1 py-0.5 hover:bg-[#000080] hover:text-white"><span className="underline">H</span>elp</button>
      </div>

      {/* Editor Content Area */}
      <textarea
        value={draft}
        readOnly={readOnly}
        onChange={event => { setDraft(event.target.value); setDirty(true); setStatus('Modified'); }}
        onKeyDown={event => {
          if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void save(); }
        }}
        className="min-h-0 flex-1 resize-none border-0 bg-white p-3 font-mono text-xs leading-5 text-black outline-none retro-sunken selection:bg-[#000080] selection:text-white cursor-text"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
        aria-label={`${node.name} contents`}
      />

      {/* Retro Status Bar */}
      <div className="h-5 bg-[#C0C0C0] px-1 py-0.5 flex items-center gap-1 text-[10px] border-t border-[#808080]">
        <div className="retro-sunken px-1.5 flex-1 h-full flex items-center justify-between">
          <span>{status}</span>
          <span>{node.name}{dirty ? ' *' : ''}</span>
        </div>
        <div className="retro-sunken px-1.5 w-24 h-full flex items-center justify-center font-mono">
          <span>Ln {draft.slice(0, draft.length).split('\n').length}, Col 1</span>
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
          <form className="w-80 bg-[#C0C0C0] retro-raised p-3 shadow-2xl flex flex-col gap-2" onSubmit={event => {
            event.preventDefault();
            const index = draft.toLowerCase().indexOf(findTerm.toLowerCase());
            if (index >= 0) setStatus(`Found at character ${index + 1}`);
            else setStatus('String not found');
          }}>
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
    </div>
  );
}
