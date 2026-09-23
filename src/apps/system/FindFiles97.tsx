'use client';

import { useState } from 'react';
import Button95 from '../../components/win95/Button95';
import { searchNodes } from '../../features/filesystem/filesystem-service';
import { targetForNode } from '../../features/os/open-target';
import type { OpenTarget } from '../../features/os/os-types';
import type { VfsNode } from '../../features/filesystem/filesystem-types';

export default function FindFiles97({ onOpenTarget, onClose }: { onOpenTarget: (target: OpenTarget) => void; onClose?: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VfsNode[]>([]);
  const find = async () => { if (query.trim()) setResults(await searchNodes(query.trim())); else setResults([]); };
  return <div className="win97-app win97-dialog-layout"><h2>Find: All Files</h2><div className="win97-toolbar"><label htmlFor="find-query">Named:</label><input id="find-query" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') void find(); }} /><Button95 size="sm" onClick={() => void find()}>Find Now</Button95></div><div className="sunken win97-property-list" role="listbox" aria-label="Find results">{results.length ? results.map(node => <button type="button" key={node.id} className="win97-result-row" onDoubleClick={() => onOpenTarget(targetForNode(node))}><span>{node.name}</span><small>{node.kind} · {node.size} bytes</small></button>) : <span className="win97-muted">Enter a name to search the virtual C: drive.</span>}</div><div className="win97-dialog-actions"><Button95 size="sm" onClick={() => { setQuery(''); setResults([]); }}>New Search</Button95><Button95 size="sm" onClick={onClose}>Close</Button95></div></div>;
}
