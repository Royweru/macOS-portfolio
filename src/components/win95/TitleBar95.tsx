import type { MouseEventHandler, ReactNode } from 'react';

interface TitleBar95Props {
  title: string;
  icon?: ReactNode;
  isActive?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  showMaximize?: boolean;
  maximizeDisabled?: boolean;
  onClose?: () => void;
  onDoubleClick?: MouseEventHandler<HTMLDivElement>;
}

export default function TitleBar95({ title, icon, isActive = true, onMinimize, onMaximize, showMaximize = true, maximizeDisabled = false, onClose, onDoubleClick }: TitleBar95Props) {
  return (
    <div className={`win95-titlebar ${isActive ? 'active' : 'inactive'}`} onDoubleClick={onDoubleClick}>
      <div className="win95-titlebar-label">{icon && <span className="win95-titlebar-icon">{icon}</span>}<span>{title}</span></div>
      <div className="win95-titlebar-controls" onPointerDown={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}>
        {onMinimize && <button type="button" data-window-control="minimize" aria-label="Minimize" onClick={onMinimize}>_</button>}
        {showMaximize && <button type="button" data-window-control="maximize" aria-label="Maximize" disabled={maximizeDisabled} onClick={onMaximize}>□</button>}
        {onClose && <button type="button" data-window-control="close" aria-label="Close" onClick={onClose}>×</button>}
      </div>
    </div>
  );
}
