'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import AppIcon from '../components/AppIcon';
import Button95 from '../components/win95/Button95';
import RecycleBinEmptyAlert97 from '../apps/recycle-bin/RecycleBinEmptyAlert97';
import { actionLeavesRecycleBinEmpty97 } from '../apps/recycle-bin/recycle-bin-actions97';
import { deleteTrashEntry, emptyTrash, listTrash, restoreTrashEntry } from '../features/filesystem/filesystem-service';
import { soundEngine } from '../os/sound/synth';

type RecycleBinConfirmation97 = { type: 'empty' } | { type: 'delete'; id: string };

export default function RecycleBinContent() {
  const entries = useLiveQuery(() => listTrash(), [], []);
  const [confirm, setConfirm] = useState<RecycleBinConfirmation97 | null>(null);
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);
  const confirmAction = async () => {
    if (!confirm) return;
    const entryCountBeforeAction = entries?.length ?? 0;
    if (confirm.type === 'empty') {
      await emptyTrash();
      soundEngine.play('crunch');
    } else {
      await deleteTrashEntry(confirm.id);
    }
    if (actionLeavesRecycleBinEmpty97(confirm.type, entryCountBeforeAction)) setShowEmptyAlert(true);
    setConfirm(null);
  };

  return (
    <div className="win97-recycle-app">
      <div className="win97-recycle-toolbar"><span className="win97-recycle-caption"><AppIcon appId="recycle" size={18} /> Recycle Bin</span><Button95 size="sm" disabled={!entries.length} onClick={() => setConfirm({ type: 'empty' })}>Empty Recycle Bin</Button95></div>
      <div className="win97-recycle-list" role="list" aria-label="Deleted files">
        {entries.length === 0 ? <div className="win97-recycle-empty" role="status"><AppIcon appId="recycle" size={48} /><div><b>The Recycle Bin is empty.</b><span>There are no deleted portfolio files to restore.</span></div></div> : entries.map(entry => <div key={entry.id} className="win97-recycle-row" role="listitem"><span className="win97-recycle-file"><AppIcon appId="file" size={22} /><span><b>{entry.originalName}</b><small>Deleted {new Date(entry.deletedAt).toLocaleString()}</small></span></span><span className="win97-recycle-actions"><Button95 size="sm" onClick={() => void restoreTrashEntry(entry.id)}>Restore</Button95><Button95 size="sm" onClick={() => setConfirm({ type: 'delete', id: entry.id })}>Delete permanently</Button95></span></div>)}
      </div>
      {showEmptyAlert && <RecycleBinEmptyAlert97 onDismiss={() => setShowEmptyAlert(false)} />}
      {confirm && <div className="win97-recycle-modal" role="dialog" aria-modal="true" aria-label={confirm.type === 'empty' ? 'Empty Recycle Bin' : 'Delete permanently'}><section className="win97-recycle-confirm"><div className="win97-recycle-confirm-title"><AppIcon appId="recycle" size={16} /> Weru 97</div><div className="win97-recycle-confirm-body"><AppIcon appId="system-properties" size={32} /><div><b>{confirm.type === 'empty' ? 'Empty Recycle Bin?' : 'Delete permanently?'}</b><p>This action cannot be undone.</p></div></div><div className="win97-dialog-actions"><Button95 size="sm" onClick={() => setConfirm(null)}>Cancel</Button95><Button95 size="sm" onClick={() => void confirmAction()}>OK</Button95></div></section></div>}
    </div>
  );
}
