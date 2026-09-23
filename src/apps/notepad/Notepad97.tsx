'use client';

import NotepadContent from '../../windows/NotepadContent';

export default function Notepad97(props: { fileId?: string }) {
  return <div className="win97-notepad"><NotepadContent {...props} /></div>;
}
