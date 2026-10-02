'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';

interface UnsavedChangesDialog97Props {
  title: string;
  onDiscard: () => void;
  onCancel: () => void;
}

export default function UnsavedChangesDialog97({ title, onDiscard, onCancel }: UnsavedChangesDialog97Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { cancelRef.current?.focus(); }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
    }
  };

  return <div className="window97-close-confirm-layer" onPointerDown={event => event.stopPropagation()}>
    <section className="window97-close-confirm" role="alertdialog" aria-modal="true" aria-labelledby="window97-close-confirm-title" aria-describedby="window97-close-confirm-message" onKeyDown={handleKeyDown}>
      <header className="window97-close-confirm-titlebar">
        <span id="window97-close-confirm-title">Confirm Close — {title}</span>
        <button type="button" aria-label="Cancel close" onClick={onCancel}>×</button>
      </header>
      <div className="window97-close-confirm-body">
        <span className="window97-close-confirm-icon" aria-hidden="true">?</span>
        <p id="window97-close-confirm-message">This document has unsaved changes.<br />Close without saving?</p>
      </div>
      <footer className="window97-close-confirm-actions">
        <button type="button" onClick={onDiscard}>Close Without Saving</button>
        <button ref={cancelRef} type="button" autoFocus onClick={onCancel}>Cancel</button>
      </footer>
    </section>
  </div>;
}
