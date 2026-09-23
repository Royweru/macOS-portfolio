import type { ReactNode } from 'react';
import TitleBar95 from './TitleBar95';

interface Dialog95Props {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
}

export default function Dialog95({ title, children, footer, icon, onClose }: Dialog95Props) {
  return <section className="win95-dialog raised" role="dialog" aria-label={title}><TitleBar95 title={title} icon={icon} onClose={onClose} /><div className="win95-dialog-body">{children}</div>{footer && <div className="win95-dialog-footer">{footer}</div>}</section>;
}
