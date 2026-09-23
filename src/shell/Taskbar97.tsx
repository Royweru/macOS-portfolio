'use client';

import type { OpenTarget, WindowInstance } from '../features/os/os-types';
import { useOsStore } from '../features/os/os-store';
import AppIcon from '../components/AppIcon';
import { Clock95 } from '../components/win95';
import StartMenu97 from './StartMenu97';
import { soundEngine } from '../os/sound/synth';

interface Taskbar97Props {
  openInstances: WindowInstance[];
  focusedWindowId: string | null;
  onOpenTarget: (target: OpenTarget) => void;
  onFocusWindow: (id: string) => void;
}

export default function Taskbar97({ openInstances, focusedWindowId, onOpenTarget, onFocusWindow }: Taskbar97Props) {
  const startMenuOpen = useOsStore((state) => state.startMenuOpen);
  const toggleStartMenu = useOsStore((state) => state.toggleStartMenu);
  const minimizeWindow = useOsStore((state) => state.minimizeWindow);
  const minimizeAll = () => openInstances.forEach((instance) => minimizeWindow(instance.id));
  return <>
    {startMenuOpen && <div className="start97-backdrop" onClick={() => useOsStore.getState().setStartMenuOpen(false)} />}
    {startMenuOpen && <StartMenu97 onOpenTarget={onOpenTarget} onClose={() => useOsStore.getState().setStartMenuOpen(false)} />}
    <footer className="taskbar97" role="toolbar" aria-label="Weru 97 taskbar">
      <button type="button" className={`start97-button raised ${startMenuOpen ? 'pressed' : ''}`} onClick={() => { soundEngine.play('pop'); toggleStartMenu(); }}><span className="start97-logo">W</span><strong>Start</strong></button>
      <span className="taskbar97-divider" aria-hidden="true" />
      <nav className="taskbar97-quicklaunch" aria-label="Quick launch">
        <button type="button" className="taskbar97-quick-button raised" aria-label="Show desktop" title="Show desktop" onClick={minimizeAll}>▣</button>
        <button type="button" className="taskbar97-quick-button raised" aria-label="Launch Internet Explorer" title="Internet Explorer" onClick={() => onOpenTarget({ kind: 'application', appId: 'ie4' })}><AppIcon appId="ie4" size={20} /></button>
        <button type="button" className="taskbar97-quick-button raised" aria-label="Launch Notepad" title="Notepad" onClick={() => onOpenTarget({ kind: 'application', appId: 'notepad' })}><AppIcon appId="notepad" size={20} /></button>
        <button type="button" className="taskbar97-quick-button raised" aria-label="Open My Documents" title="My Documents" onClick={() => onOpenTarget({ kind: 'folder', nodeId: 'folder-my-documents' })}><AppIcon appId="folder" size={20} /></button>
        <button type="button" className="taskbar97-quick-button raised" aria-label="Launch CD Player" title="CD Player" onClick={() => onOpenTarget({ kind: 'application', appId: 'cd-player' })}><AppIcon appId="cd-player" size={20} /></button>
      </nav>
      <div className="taskbar97-windows">{openInstances.map((instance) => <button type="button" key={instance.id} className={`taskbar97-window raised ${instance.id === focusedWindowId ? 'focused' : ''} ${instance.mode === 'minimized' ? 'minimized' : ''}`} onClick={() => onFocusWindow(instance.id)}><AppIcon appId={instance.appId} size={18} /><span>{instance.title}</span></button>)}</div>
      <div className="taskbar97-tray"><span className="taskbar97-tray-icon" title="Sound">▮))</span><span className="taskbar97-tray-icon" title="Network">▣</span><span className="taskbar97-status">Weru 97</span><Clock95 /></div>
    </footer>
  </>;
}
