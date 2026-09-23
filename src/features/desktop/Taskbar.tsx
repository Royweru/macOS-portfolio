'use client';

import { useEffect, useState } from 'react';
import { Search, Wifi, BatteryMedium, Volume2, ChevronUp } from 'lucide-react';
import type { WindowId } from '../../types';
import type { WindowInstance } from '../os/os-types';
import type { OpenTarget } from '../os/os-types';
import StartMenu from './StartMenu';
import AppIcon from '../../components/AppIcon';
import QuickSettings from './QuickSettings';

interface TaskbarProps {
  openWindows: WindowId[];
  focusedWindow: WindowId | null;
  onOpenTarget: (target: OpenTarget) => void;
  onSearch: () => void;
  openInstances: WindowInstance[];
  focusedWindowId: string | null;
  onFocusWindow: (id: string) => void;
}

const pinnedApps: Array<{ id: string; iconId: WindowId; label: string; target: OpenTarget }> = [
  { id: 'explorer', iconId: 'explorer', label: 'File Explorer', target: { kind: 'application', appId: 'explorer' } },
  { id: 'projects', iconId: 'explorer', label: 'Projects', target: { kind: 'folder', nodeId: 'folder-projects' } },
  { id: 'terminal', iconId: 'terminal', label: 'Terminal', target: { kind: 'application', appId: 'terminal' } },
  { id: 'notepad', iconId: 'notepad', label: 'Notepad', target: { kind: 'application', appId: 'notepad' } },
  { id: 'settings', iconId: 'settings', label: 'Settings', target: { kind: 'application', appId: 'settings' } },
  { id: 'media-player', iconId: 'media-player', label: 'Media Player', target: { kind: 'application', appId: 'media-player' } },
  { id: 'recycle-bin', iconId: 'recycle-bin', label: 'Recycle Bin', target: { kind: 'recycle-bin' } },
];

export default function Taskbar({ openWindows, focusedWindow, onOpenTarget, onSearch, openInstances, focusedWindowId, onFocusWindow }: TaskbarProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const openSearch = () => { setStartOpen(false); setQuickSettingsOpen(false); onSearch(); };
  const closeTransientSurfaces = () => { setStartOpen(false); setQuickSettingsOpen(false); };

  return (
    <>
      {(startOpen || quickSettingsOpen) && <div className="windows-start-backdrop" onClick={closeTransientSurfaces} aria-hidden="true" />}
      {startOpen && <StartMenu onOpenTarget={onOpenTarget} onSearch={openSearch} onClose={() => setStartOpen(false)} />}
      {quickSettingsOpen && <QuickSettings onClose={() => setQuickSettingsOpen(false)} />}
      <div className="windows-taskbar" role="toolbar" aria-label="Windows taskbar">
        <div className="windows-taskbar-apps">
          <button type="button" className={`windows-taskbar-button windows-start-button ${startOpen ? 'active' : ''}`} onClick={() => setStartOpen(value => !value)} aria-label="Start" aria-expanded={startOpen} title="Start"><span className="windows-logo" aria-hidden="true"><i /><i /><i /><i /></span></button>
          <button type="button" className="windows-taskbar-search" onClick={openSearch} aria-label="Search" title="Search"><Search size={17} /><span>Search</span></button>
          <span className="windows-taskbar-divider" aria-hidden="true" />
          {pinnedApps.map(app => {
            const isOpen = app.id === 'projects' ? openWindows.includes('explorer') : openWindows.includes(app.id as WindowId);
            const isFocused = app.id === 'projects' ? focusedWindow === 'explorer' : focusedWindow === app.id;
            return <button type="button" key={app.id} className={`windows-taskbar-app ${isOpen ? 'open' : ''} ${isFocused ? 'focused' : ''}`} onClick={() => onOpenTarget(app.target)} title={app.label} aria-label={app.label}><span className="taskbar-app-icon"><AppIcon appId={app.iconId} size={19} /></span><i aria-hidden="true" /></button>;
          })}
          {openInstances.filter(instance => instance.appId === 'project-detail').map(instance => <button type="button" key={instance.id} className={`windows-taskbar-app open ${focusedWindowId === instance.id ? 'focused' : ''}`} onClick={() => onFocusWindow(instance.id)} title={instance.title} aria-label={instance.title}><span className="taskbar-app-icon"><AppIcon appId="project-detail" size={19} /></span><i aria-hidden="true" /></button>)}
        </div>
        <div className="windows-taskbar-tray">
          <button type="button" className={`taskbar-tray-button ${quickSettingsOpen ? 'active' : ''}`} onClick={() => { setStartOpen(false); setQuickSettingsOpen(value => !value); }} aria-label="Show hidden icons" aria-expanded={quickSettingsOpen} title="Quick settings"><ChevronUp size={13} /></button>
          <Wifi size={14} aria-label="Network connected" />
          <Volume2 size={14} aria-label="Volume" />
          <BatteryMedium size={16} aria-label="Battery 84 percent" />
          <span className="windows-taskbar-clock"><span>{time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><span>{time.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })}</span></span>
        </div>
      </div>
    </>
  );
}
