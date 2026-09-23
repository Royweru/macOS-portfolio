'use client';

import { useMemo, useState } from 'react';
import { Search, Power, UserCircle2 } from 'lucide-react';
import type { WindowId } from '../../types';
import type { OpenTarget } from '../os/os-types';
import { WINDOW_CONFIGS } from '../../constants';
import AppIcon from '../../components/AppIcon';

interface StartMenuProps {
  onOpenTarget: (target: OpenTarget) => void;
  onSearch: () => void;
  onClose: () => void;
}

const APP_ORDER: WindowId[] = ['explorer', 'terminal', 'notepad', 'settings', 'media-player', 'photos', 'mail', 'recycle-bin'];

export default function StartMenu({ onOpenTarget, onSearch, onClose }: StartMenuProps) {
  const [query, setQuery] = useState('');
  const apps = useMemo(() => APP_ORDER.filter(id => {
    const value = query.trim().toLowerCase();
    return !value || WINDOW_CONFIGS[id].title.toLowerCase().includes(value);
  }), [query]);

  return (
    <div className="windows-start-menu" role="dialog" aria-label="Start menu">
      <div className="windows-start-search">
        <Search size={16} aria-hidden="true" />
        <input
          autoFocus
          value={query}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'Enter' && apps[0]) {
              onOpenTarget(apps[0] === 'notepad' ? { kind: 'file', nodeId: 'file-about-me' } : { kind: 'application', appId: apps[0] });
              onClose();
            }
          }}
          placeholder="Search apps, projects, and files"
          aria-label="Search apps, projects, and files"
        />
      </div>

      <div className="windows-start-heading">
        <span>Pinned</span>
        <button type="button" onClick={onSearch}>All apps</button>
      </div>

      <div className="windows-start-grid">
        {apps.map(id => {
          const config = WINDOW_CONFIGS[id];
          return (
            <button type="button" className="windows-start-app" key={id} onClick={() => { onOpenTarget(id === 'notepad' ? { kind: 'file', nodeId: 'file-about-me' } : { kind: 'application', appId: id }); onClose(); }}>
              <span className="windows-start-app-icon"><AppIcon appId={id} size={23} /></span>
              <span>{config.title}</span>
            </button>
          );
        })}
      </div>

      <div className="windows-start-recommended">
        <div className="windows-start-heading"><span>Recommended</span></div>
        <button type="button" className="windows-start-recommendation" onClick={() => { onOpenTarget({ kind: 'folder', nodeId: 'folder-projects' }); onClose(); }}>
          <span className="windows-start-recommendation-icon"><AppIcon appId="explorer" size={22} /></span>
          <span><strong>Explore recent projects</strong><small>Open the portfolio workspace</small></span>
        </button>
      </div>

      <div className="windows-start-footer">
        <span className="windows-start-user"><UserCircle2 size={18} /> Weru</span>
        <button type="button" aria-label="Power options" title="Power options"><Power size={17} /></button>
      </div>
    </div>
  );
}
