'use client';

import NotepadContent from '../../windows/NotepadContent';
import type { OpenTarget } from '../../features/os/os-types';

export default function Notepad97(props: { fileId?: string; onOpenTarget?: (target: OpenTarget) => void }) {
  return <div className="win97-notepad"><NotepadContent {...props} /></div>;
}
