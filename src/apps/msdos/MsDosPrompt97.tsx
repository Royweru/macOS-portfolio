'use client';

import TerminalContent from '../../windows/TerminalContent';
import type { OsCommand } from '../../features/os/os-types';

export default function MsDosPrompt97({ initialCwd, onEffect }: { initialCwd?: string; onEffect: (effect: OsCommand) => void }) {
  return <div className="win97-msdos"><TerminalContent initialCwd={initialCwd} onEffect={onEffect} /></div>;
}
