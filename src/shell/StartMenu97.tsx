'use client';

import type { OpenTarget } from '../features/os/os-types';
import AppIcon from '../components/AppIcon';
import { useState } from 'react';

export default function StartMenu97({ onOpenTarget, onClose }: { onOpenTarget: (target: OpenTarget) => void; onClose: () => void }) {
  const [programsOpen, setProgramsOpen] = useState(false);
  const launch = (target: OpenTarget) => { onOpenTarget(target); onClose(); };
  const rows: Array<{ icon: string; label: string; target?: OpenTarget; arrow?: boolean }> = [
    { icon: 'folder', label: 'Programs', target: { kind: 'folder', nodeId: 'folder-program-files' }, arrow: true },
    { icon: 'document', label: 'Documents', target: { kind: 'folder', nodeId: 'folder-my-documents' }, arrow: true },
    { icon: 'system-properties', label: 'Settings', target: { kind: 'application', appId: 'control-panel' }, arrow: true },
    { icon: 'find', label: 'Find', target: { kind: 'application', appId: 'find' }, arrow: true },
    { icon: 'document', label: 'Help', target: { kind: 'application', appId: 'system-properties' } },
    { icon: 'run', label: 'Run...', target: { kind: 'application', appId: 'run' } },
  ];
  const programs: Array<{ icon: string; label: string; target?: OpenTarget; disabled?: boolean }> = [
    { icon: 'folder', label: 'Windows Explorer', target: { kind: 'folder', nodeId: 'folder-my-documents' } },
    { icon: 'notepad', label: 'Notepad', target: { kind: 'application', appId: 'notepad' } },
    { icon: 'notepad', label: 'WordPad', disabled: true },
    { icon: 'paint', label: 'Paint', target: { kind: 'application', appId: 'paint' } },
    { icon: 'media-player', label: 'Weru Media Player 6.4', target: { kind: 'application', appId: 'media-player' } },
    { icon: 'cd-player', label: 'CD Player', target: { kind: 'application', appId: 'cd-player' } },
    { icon: 'calculator', label: 'Calculator', target: { kind: 'application', appId: 'calculator' } },
    { icon: 'internet-explorer', label: 'Internet Explorer', target: { kind: 'application', appId: 'ie4' } },
    { icon: 'minesweeper', label: 'Minesweeper', target: { kind: 'application', appId: 'minesweeper' } },
    { icon: 'msdos', label: 'MS-DOS Prompt', target: { kind: 'application', appId: 'msdos' } },
    { icon: 'control-panel', label: 'Control Panel', target: { kind: 'application', appId: 'control-panel' } },
    { icon: 'system-properties', label: 'System Properties', target: { kind: 'application', appId: 'system-properties' } },
  ];
  return <div className="start97 raised" role="menu" aria-label="Start menu">
    <div className="start97-brand">Weru <strong>97</strong></div>
    <div className="start97-body">{rows.map(({ icon, label, target, arrow }) => <button type="button" className="start97-row" key={label} onClick={() => label === 'Programs' ? setProgramsOpen(open => !open) : target && launch(target)}><AppIcon appId={icon} size={18} /><span><u>{label[0]}</u>{label.slice(1)}</span>{arrow && <span className="start97-arrow">►</span>}</button>)}<div className="start97-divider" /><button type="button" className="start97-row" onClick={() => launch({ kind: 'application', appId: 'shutdown' })}><AppIcon appId="shutdown" size={18} /><span>Sh<u>u</u>t Down...</span></button></div>
    {programsOpen && <div className="start97-programs" role="menu" aria-label="Programs">{programs.map((program) => <button type="button" key={program.label} disabled={program.disabled} onClick={() => program.target && launch(program.target)}><AppIcon appId={program.icon} size={16} /><span>{program.label}</span></button>)}</div>}
  </div>;
}
