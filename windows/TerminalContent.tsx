'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Clipboard, Plus, RotateCcw, Terminal as TerminalIcon, X } from 'lucide-react';
import { executeTerminalCommand, getCommandNames } from '../src/features/terminal/terminal-commands';
import { completeCommand, parseCommand } from '../src/features/terminal/terminal-parser';
import type { TerminalLine, TerminalSession } from '../src/features/terminal/terminal-types';
import type { OsCommand } from '../src/features/os/os-types';
import { getBrowserProfileId } from '../src/features/os/profile-storage';

interface TerminalContentProps { onEffect: (effect: OsCommand) => void; initialCwd?: string; }

const HISTORY_KEY = `weru-terminal-history-v1-${getBrowserProfileId()}`;
const MAX_HISTORY = 100;

const makeLine = (text: string, kind: TerminalLine['kind'] = 'output'): TerminalLine => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  text,
  kind,
});

const createSession = (index: number, history: string[] = [], cwd = 'C:\\Users\\Admin'): TerminalSession => ({
  id: `terminal-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  title: `Terminal ${index}`,
  cwd,
  history,
  output: [
    makeLine('Weru OS Terminal 1.0', 'system'),
    makeLine('Sandboxed portfolio shell · type `help` to begin.', 'info'),
  ],
});

export default function TerminalContent({ onEffect, initialCwd }: TerminalContentProps) {
  const [sessions, setSessions] = useState<TerminalSession[]>(() => {
    let history: string[] = [];
    try {
      if (typeof window !== 'undefined') {
        const saved = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? '[]');
        if (Array.isArray(saved)) history = saved.filter((item): item is string => typeof item === 'string').slice(-MAX_HISTORY);
      }
    } catch { /* A broken history must never prevent Terminal from opening. */ }
    return [createSession(1, history, initialCwd)];
  });
  const [activeId, setActiveId] = useState(() => sessions[0]?.id ?? '');
  const [input, setInput] = useState('');
  const [historyCursor, setHistoryCursor] = useState(-1);
  const [completionIndex, setCompletionIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const commandNames = useMemo(() => getCommandNames(), []);

  const active = sessions.find(session => session.id === activeId) ?? sessions[0];

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [active?.output.length, active?.id]);

  const updateActive = (update: (session: TerminalSession) => TerminalSession) => {
    if (!active) return;
    setSessions(current => current.map(session => session.id === active.id ? update(session) : session));
  };

  const appendLines = (lines: TerminalLine[]) => updateActive(session => ({ ...session, output: [...session.output, ...lines] }));

  const runCommand = async () => {
    const raw = input.trim();
    if (!active || !raw || isRunning) return;
    const parsed = parseCommand(raw);
    setInput('');
    setHistoryCursor(-1);
    setCompletionIndex(0);
    appendLines([makeLine(`${active.cwd}> ${raw}`, 'system')]);
    const nextHistory = [...active.history.filter(command => command !== raw), raw].slice(-MAX_HISTORY);
    updateActive(session => ({ ...session, history: nextHistory }));
    try { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory)); } catch { /* Storage is optional. */ }
    if (parsed?.name === 'clear') { updateActive(session => ({ ...session, output: [] })); return; }
    const controller = new AbortController();
    abortRef.current = controller;
    setIsRunning(true);
    const result = await executeTerminalCommand(parsed, { cwd: active.cwd, signal: controller.signal, emitEffect: onEffect });
    setIsRunning(false);
    abortRef.current = null;
    if (result.nextCwd) updateActive(session => ({ ...session, cwd: result.nextCwd ?? session.cwd }));
    if (result.lines.length) appendLines(result.lines.map(resultLine => makeLine(resultLine.text, resultLine.kind)));
    result.effects?.forEach(onEffect);
  };

  const newTab = () => {
    const session = createSession(sessions.length + 1);
    setSessions(current => [...current, session]);
    setActiveId(session.id);
    setInput('');
  };

  const closeTab = (id: string) => {
    if (sessions.length === 1) { onEffect({ type: 'close-focused-window' }); return; }
    const remaining = sessions.filter(session => session.id !== id);
    setSessions(remaining);
    if (id === activeId) setActiveId(remaining[0].id);
  };

  const copyOutput = async () => {
    if (!active) return;
    try { await navigator.clipboard.writeText(active.output.map(lineItem => lineItem.text).join('\n')); setCopied(true); window.setTimeout(() => setCopied(false), 1200); } catch { /* Clipboard permission is optional. */ }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!active) return;
    if (event.key === 'Enter') { event.preventDefault(); void runCommand(); return; }
    if (event.key === 'Tab') {
      event.preventDefault();
      const options = completeCommand(input, commandNames);
      if (options.length) { setInput(options[completionIndex % options.length]); setCompletionIndex(index => index + 1); }
      return;
    }
    if (event.key === 'ArrowUp') { event.preventDefault(); const next = Math.min(historyCursor + 1, active.history.length - 1); setHistoryCursor(next); setInput(active.history[active.history.length - 1 - next] ?? ''); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); const next = historyCursor - 1; setHistoryCursor(next); setInput(next < 0 ? '' : active.history[active.history.length - 1 - next] ?? ''); return; }
    if (event.key.toLowerCase() === 'l' && event.ctrlKey) { event.preventDefault(); updateActive(session => ({ ...session, output: [] })); return; }
    if (event.key.toLowerCase() === 'c' && event.ctrlKey) { event.preventDefault(); abortRef.current?.abort(); if (isRunning) appendLines([makeLine('^C', 'warning')]); setIsRunning(false); return; }
    if (event.key.toLowerCase() === 't' && event.ctrlKey && event.shiftKey) { event.preventDefault(); newTab(); return; }
    if (event.key.toLowerCase() === 'w' && event.ctrlKey && event.shiftKey) { event.preventDefault(); closeTab(active.id); }
  };

  return (
    <div className="terminal-app" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-tabs" role="tablist" aria-label="Terminal tabs">
        <div className="terminal-tab-list">{sessions.map(session => <button type="button" role="tab" aria-selected={session.id === active?.id} className={`terminal-tab ${session.id === active?.id ? 'active' : ''}`} key={session.id} onClick={event => { event.stopPropagation(); setActiveId(session.id); }}>{session.title}<span className="terminal-tab-close" onClick={event => { event.stopPropagation(); closeTab(session.id); }}><X size={12} /></span></button>)}</div>
        <button type="button" className="terminal-tab-action" onClick={newTab} aria-label="New terminal tab" title="New tab"><Plus size={15} /></button>
      </div>
      <div className="terminal-toolbar"><span><TerminalIcon size={14} /> Weru Terminal</span><div><button type="button" onClick={copyOutput} title="Copy output" aria-label="Copy output"><Clipboard size={14} /></button><button type="button" onClick={() => updateActive(session => ({ ...session, output: [] }))} title="Clear output" aria-label="Clear output"><RotateCcw size={14} /></button></div></div>
      <div className="terminal-output" ref={outputRef} role="log" aria-live="polite">{active?.output.map(lineItem => <div className={`terminal-line terminal-line-${lineItem.kind}`} key={lineItem.id}>{lineItem.text}</div>)}{isRunning && <div className="terminal-line terminal-line-info">running…</div>}</div>
      <div className="terminal-prompt-row"><span className="terminal-prompt">weru@portfolio {active?.cwd}&gt;</span><input ref={inputRef} value={input} onChange={event => { setInput(event.target.value); setCompletionIndex(0); }} onKeyDown={handleKeyDown} autoFocus aria-label="Terminal command input" placeholder="Type a command…" spellCheck={false} /><span className="terminal-caret" aria-hidden="true" /></div>
      <div className="terminal-status"><span>{copied ? 'Copied output' : 'Sandboxed · IndexedDB filesystem'}</span><span>Tab autocomplete · ↑↓ history · Ctrl+L clear</span></div>
    </div>
  );
}
