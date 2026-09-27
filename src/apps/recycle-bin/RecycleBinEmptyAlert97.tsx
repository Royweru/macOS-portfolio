'use client';

import Button95 from '../../components/win95/Button95';
import { createPortal } from 'react-dom';

export default function RecycleBinEmptyAlert97({ onDismiss }: { onDismiss: () => void }) {
  const dismissOnEscape = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    onDismiss();
  };

  const alert = <section className="win97-recycle-empty-alert" role="alertdialog" aria-labelledby="win97-recycle-empty-alert-title" onKeyDown={dismissOnEscape} tabIndex={-1}>
    <header className="win97-recycle-alert-titlebar">
      <span id="win97-recycle-empty-alert-title">Recycle Bin</span>
      <button type="button" className="win97-recycle-alert-close" aria-label="Close Recycle Bin empty alert" onClick={onDismiss}>×</button>
    </header>
    <div className="win97-recycle-alert-body">
      <div className="win97-recycle-alert-message">
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" shapeRendering="crispEdges">
          <circle cx="16" cy="16" r="14" fill="#3b82f6" stroke="#000" strokeWidth="1.5" />
          <text x="13" y="22" fill="#fff" fontFamily="Times New Roman, serif" fontSize="20" fontStyle="italic" fontWeight="bold">i</text>
        </svg>
        <p>The Recycle Bin is empty. Make better life choices.</p>
      </div>
      <div className="win97-recycle-alert-actions"><Button95 size="sm" autoFocus onClick={onDismiss}>OK</Button95></div>
    </div>
  </section>;

  if (typeof document === 'undefined') return alert;
  const shellDialogLayer = document.getElementById('shell97-dialog-layer');
  return shellDialogLayer ? createPortal(alert, shellDialogLayer) : alert;
}
