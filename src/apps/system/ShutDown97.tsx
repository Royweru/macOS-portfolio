'use client';

import { useState } from 'react';
import Button95 from '../../components/win95/Button95';
import { soundEngine } from '../../os/sound/synth';

type ShutdownAction97 = 'shutdown' | 'restart' | 'logon';
type ShutdownResult97 = 'shutdown' | 'logon' | null;

function ShutdownComputerArt97() {
  return <svg className="win97-shutdown-computer" viewBox="0 0 40 40" role="img" aria-label="Computer power icon" shapeRendering="crispEdges">
    <rect x="4" y="4" width="32" height="24" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
    <rect x="8" y="8" width="24" height="16" fill="#000" />
    <circle cx="20" cy="16" r="5" fill="none" stroke="#eab308" strokeWidth="2" />
    <path d="M20 11v5" stroke="#eab308" strokeWidth="2" />
    <path d="m14 28-3 6h18l-3-6Z" fill="#808080" stroke="#000" strokeWidth="1.5" />
  </svg>;
}

export default function ShutDown97({ onClose }: { onClose?: () => void }) {
  const [action, setAction] = useState<ShutdownAction97>('shutdown');
  const [result, setResult] = useState<ShutdownResult97>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const confirm = () => {
    soundEngine.play('shutdown');
    if (action === 'restart') {
      window.location.reload();
      return;
    }
    setResult(action);
  };

  if (result === 'shutdown') {
    return <button type="button" className="win97-safe-shutdown" onClick={() => window.location.reload()}>
      It's now safe to turn off your computer.
      <small>Click anywhere to restart Weru 97.</small>
    </button>;
  }

  if (result === 'logon') {
    return <div className="win97-shutdown-logon" role="status">
      <b>Weru 97 uses one local visitor session.</b>
      <span>Signing in as another user is not available in this portfolio edition.</span>
      <Button95 size="sm" autoFocus onClick={onClose}>Return to desktop</Button95>
    </div>;
  }

  return <div className="win97-app win97-shutdown-dialog">
    <div className="win97-shutdown-content">
      <ShutdownComputerArt97 />
      <div className="win97-shutdown-options">
        <p>What do you want the computer to do?</p>
        <fieldset aria-label="Shutdown action">
          <label><input type="radio" name="weru97-shutdown-action" value="shutdown" checked={action === 'shutdown'} onChange={() => setAction('shutdown')} /><span><u>S</u>hut down the computer?</span></label>
          <label><input type="radio" name="weru97-shutdown-action" value="restart" checked={action === 'restart'} onChange={() => setAction('restart')} /><span><u>R</u>estart the computer?</span></label>
          <label><input type="radio" name="weru97-shutdown-action" value="logon" checked={action === 'logon'} onChange={() => setAction('logon')} /><span>Close all programs and log on as a different user?</span></label>
        </fieldset>
      </div>
    </div>
    {helpOpen && <div className="win97-shutdown-help" role="status">
      Choose an action, then select Yes. Restart reloads Weru 97; Shut down shows the classic power-off screen.
      <button type="button" onClick={() => setHelpOpen(false)} aria-label="Close shutdown help">×</button>
    </div>}
    <footer className="win97-shutdown-actions">
      <Button95 size="sm" className="win97-shutdown-yes" autoFocus onClick={confirm}>Yes</Button95>
      <Button95 size="sm" onClick={onClose}>Cancel</Button95>
      <Button95 size="sm" onClick={() => setHelpOpen(open => !open)} aria-expanded={helpOpen}>Help</Button95>
    </footer>
  </div>;
}
