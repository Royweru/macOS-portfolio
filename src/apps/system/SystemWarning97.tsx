'use client';

import Button95 from '../../components/win95/Button95';
import { VIRTUAL_NODE_IDS } from '../../features/filesystem/virtual-paths';
import type { OpenTarget } from '../../features/os/os-types';

function WarningTriangle97() {
  return <svg className="win97-system-warning-icon" viewBox="0 0 32 32" role="img" aria-label="Warning">
    <polygon points="16,3 30,28 2,28" fill="#facc15" stroke="#000" strokeWidth="2" />
    <rect x="14.5" y="10" width="3" height="9" fill="#000" />
    <rect x="14.5" y="22" width="3" height="3" fill="#000" />
  </svg>;
}

export default function SystemWarning97({ onOpenTarget, onClose }: {
  onOpenTarget: (target: OpenTarget) => void;
  onClose: () => void;
}) {
  const exploreProjects = () => {
    onClose();
    onOpenTarget({ kind: 'folder', nodeId: VIRTUAL_NODE_IDS.projects });
  };

  return <div className="win97-app win97-system-warning">
    <div className="win97-system-warning-message">
      <WarningTriangle97 />
      <p>Are you sure sure you want to explore amazing work?</p>
    </div>
    <div className="win97-system-warning-actions">
      <Button95 size="sm" className="win97-system-warning-yes" onClick={exploreProjects}>yes</Button95>
      <Button95 size="sm" className="win97-system-warning-cancel" onClick={onClose}>cancel</Button95>
    </div>
  </div>;
}
