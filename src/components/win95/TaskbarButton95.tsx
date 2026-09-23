import type { ReactNode } from 'react';

interface TaskbarButton95Props {
  children: ReactNode;
  active?: boolean;
  pressed?: boolean;
  onClick?: () => void;
  label: string;
}

export default function TaskbarButton95({ children, active = false, pressed = false, onClick, label }: TaskbarButton95Props) {
  return <button type="button" className={`win95-taskbar-button ${active ? 'active' : ''} ${pressed ? 'pressed' : ''}`} onClick={onClick} aria-label={label} title={label}>{children}<span>{label}</span></button>;
}
