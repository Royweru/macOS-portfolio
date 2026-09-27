'use client';

import { useRef, useState } from 'react';
import Button95 from '../../components/win95/Button95';
import { findFiles97 } from './find-files97';
import { targetForNode } from '../../features/os/open-target';
import type { OpenTarget } from '../../features/os/os-types';
import type { VfsNode } from '../../features/filesystem/filesystem-types';

export default function FindFiles97({ onOpenTarget, onClose }: { onOpenTarget: (target: OpenTarget) => void; onClose?: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VfsNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const find = async () => {
    const activeRequest = ++requestId.current;
    setSelectedId(null);
    setError('');
    setSearched(true);
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      setBusy(false);
      return;
    }

    setBusy(true);
    try {
      const found = await findFiles97(query);
      if (activeRequest !== requestId.current) return;
      setResults(found);
    } catch {
      if (activeRequest !== requestId.current) return;
      setResults([]);
      setError('The virtual C: drive could not be searched. Try again.');
    } finally {
      if (activeRequest === requestId.current) setBusy(false);
    }
  };

  const resetSearch = () => {
    requestId.current += 1;
    setQuery('');
    setResults([]);
    setSelectedId(null);
    setSearched(false);
    setBusy(false);
    setError('');
    inputRef.current?.focus();
  };

  const updateQuery = (value: string) => {
    requestId.current += 1;
    setQuery(value);
    setResults([]);
    setSelectedId(null);
    setSearched(false);
    setBusy(false);
    setError('');
  };

  const openNode = (node: VfsNode) => onOpenTarget(targetForNode(node));
  const selectedNode = results.find(node => node.id === selectedId);

  return <div className="win97-app win97-dialog-layout">
    <h2>Find: All Files</h2>
    <div className="win97-toolbar">
      <label htmlFor="find-query">Named:</label>
      <input
        ref={inputRef}
        id="find-query"
        value={query}
        onChange={event => updateQuery(event.target.value)}
        onKeyDown={event => { if (event.key === 'Enter') void find(); }}
      />
      <Button95 size="sm" disabled={busy} onClick={() => void find()}>{busy ? 'Searching…' : 'Find Now'}</Button95>
    </div>
    <div className="sunken win97-property-list" aria-label="Find results" aria-live="polite">
      {error ? <span role="alert" className="win97-muted">{error}</span>
        : busy ? <span className="win97-muted">Searching the virtual C: drive…</span>
          : results.length ? results.map(node => <button
            type="button"
            key={node.id}
            className={`win97-result-row${selectedId === node.id ? ' selected' : ''}`}
            aria-pressed={selectedId === node.id}
            onClick={() => setSelectedId(node.id)}
            onDoubleClick={() => openNode(node)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                openNode(node);
              }
            }}
          ><span>{node.name}</span><small>{node.kind} · {node.size} bytes</small></button>)
            : searched ? <span className="win97-muted">No matching files were found.</span>
              : <span className="win97-muted">Enter a name to search the virtual C: drive.</span>}
    </div>
    <div className="win97-dialog-actions">
      <Button95 size="sm" disabled={!selectedNode} onClick={() => selectedNode && openNode(selectedNode)}>Open</Button95>
      <Button95 size="sm" onClick={resetSearch}>New Search</Button95>
      <Button95 size="sm" onClick={onClose}>Close</Button95>
    </div>
  </div>;
}
