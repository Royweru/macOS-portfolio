/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import '@fontsource/vt323/latin-400.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weru 97 — Portfolio Operating System',
  description: 'An interactive Weru 97-inspired portfolio operating system by Roy Weru Matheri.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
