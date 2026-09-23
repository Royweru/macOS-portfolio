'use client';

import { useState } from 'react';
import Button95 from '../../components/win95/Button95';
import AppIcon from '../../components/AppIcon';

const aliases: Record<string, string> = { calc: 'calculator', winmine: 'minesweeper', iexplore: 'ie4', msdos: 'msdos', cdplayer: 'cd-player', mspaint: 'paint', explorer: 'explorer', notepad: 'notepad', control: 'control-panel' };

export default function RunDialog97({ onOpenApp, onClose }: { onOpenApp: (appId: string) => void; onClose?: () => void }) {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const run = () => { const command = value.trim().toLowerCase(); if (command === 'regedit' || command === 'format c:') { setMessage('Access denied. This protected Weru 97 runtime cannot modify system state.'); return; } const app = aliases[command]; if (!app) { setMessage(`Windows cannot find '${value}'. Check the spelling and try again.`); return; } onOpenApp(app); setValue(''); setMessage(''); onClose?.(); };
  return <div className="win97-app win97-dialog-layout"><div className="win97-property-header"><div className="win95-icon32"><AppIcon appId="run" size={32} /></div><div><b>Run</b><p>Type the name of a program, folder, document, or Internet resource, and Weru 97 will open it for you.</p></div></div><label htmlFor="run-command">Open:</label><input id="run-command" autoFocus value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') run(); }} />{message && <p role="alert" className="win97-muted">{message}</p>}<div className="win97-dialog-actions"><Button95 size="sm" onClick={run}>OK</Button95><Button95 size="sm" onClick={onClose}>Cancel</Button95></div></div>;
}
