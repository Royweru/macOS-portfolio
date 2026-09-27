'use client';

import { useRef, useState } from 'react';
import Button95 from '../../components/win95/Button95';
import AppIcon from '../../components/AppIcon';
import { parseRunCommand97, resolveRunFileTarget97 } from './run-command97';
import type { OpenTarget } from '../../features/os/os-types';

export default function RunDialog97({ onOpenApp, onOpenTarget, onClose }: { onOpenApp: (appId: string) => void; onOpenTarget: (target: OpenTarget) => void; onClose?: () => void }) {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const requestId = useRef(0);

  const close = () => { requestId.current += 1; onClose?.(); };
  const finish = () => { requestId.current += 1; setValue(''); setMessage(''); onClose?.(); };
  const run = () => {
    const activeRequest = ++requestId.current;
    const command = parseRunCommand97(value);
    setMessage('');

    // Preserve the browser's user-activation window for external navigation.
    if (command.kind === 'external') {
      onOpenTarget({ kind: 'external', url: command.url });
      finish();
      return;
    }
    if (command.kind === 'application') {
      onOpenApp(command.appId);
      finish();
      return;
    }
    if (command.kind === 'error') {
      setMessage(command.message);
      return;
    }

    void resolveRunFileTarget97(command).then(result => {
      if (activeRequest !== requestId.current) return;
      if ('error' in result) {
        setMessage(result.error);
        return;
      }
      onOpenTarget(result.target);
      finish();
    }).catch(() => {
      if (activeRequest === requestId.current) setMessage('The requested item could not be read from the Weru filesystem.');
    });
  };

  return <div className="win97-app win97-dialog-layout"><div className="win97-property-header"><div className="win95-icon32"><AppIcon appId="run" size={32} /></div><div><b>Run</b><p>Type the name of a program, folder, document, or Internet resource, and Weru 97 will open it for you.</p></div></div><label htmlFor="run-command">Open:</label><input id="run-command" autoFocus value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') run(); }} />{message && <p role="alert" className="win97-muted">{message}</p>}<div className="win97-dialog-actions"><Button95 size="sm" onClick={run}>OK</Button95><Button95 size="sm" onClick={close}>Cancel</Button95></div></div>;
}
