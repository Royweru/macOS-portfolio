import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Button95Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  pressed?: boolean;
  size?: 'sm' | 'md';
}

export default function Button95({ children, pressed = false, size = 'md', className = '', ...props }: Button95Props) {
  return <button {...props} className={`win95-button win95-button-${size} ${pressed ? 'win95-button-pressed' : ''} ${className}`}>{children}</button>;
}
