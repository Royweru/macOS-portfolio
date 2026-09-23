'use client';

import { useState } from 'react';
import Button95 from '../../components/win95/Button95';

export default function ShutDown97({ onClose }: { onClose?: () => void }) {
  const [safe, setSafe] = useState(false);
  const [action, setAction] = useState<'shutdown' | 'restart' | 'logon'>('shutdown');
  const confirm = () => { if (action === 'restart') window.location.reload(); else setSafe(true); };
  if (safe) return <button type="button" className="win97-safe-shutdown" onClick={() => window.location.reload()}>It's now safe to turn off your computer.<small>Click anywhere to restart Weru 97.</small></button>;
  return <div className="win97-app win97-dialog-layout"><h2>Shut Down Weru 97</h2><p>What do you want the computer to do?</p><label><input type="radio" checked={action === 'shutdown'} onChange={() => setAction('shutdown')} name="power" /> Shut down</label><label><input type="radio" checked={action === 'restart'} onChange={() => setAction('restart')} name="power" /> Restart</label><label><input type="radio" checked={action === 'logon'} onChange={() => setAction('logon')} name="power" /> Close all programs and log on as a different user</label><div className="win97-dialog-actions"><Button95 size="sm" onClick={confirm}>OK</Button95><Button95 size="sm" onClick={onClose}>Cancel</Button95><Button95 size="sm">Help</Button95></div></div>;
}
