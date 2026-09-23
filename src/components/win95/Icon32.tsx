import type { ReactNode } from 'react';

export default function Icon32({ children, label }: { children: ReactNode; label?: string }) {
  return <span className="win95-icon32" aria-label={label}>{children}</span>;
}
