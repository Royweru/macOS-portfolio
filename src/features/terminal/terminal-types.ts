import type { VfsNode } from '../filesystem/filesystem-types';
import type { OsCommand } from '../os/os-types';

export type TerminalLineKind = 'output' | 'success' | 'info' | 'warning' | 'error' | 'system';

export interface TerminalLine {
  id: string;
  text: string;
  kind: TerminalLineKind;
}

export interface TerminalSession {
  id: string;
  title: string;
  cwd: string;
  history: string[];
  output: TerminalLine[];
}

export interface CommandResult {
  lines: Array<Omit<TerminalLine, 'id'>>;
  nextCwd?: string;
  effects?: OsCommand[];
  exitCode: number;
}

export interface TerminalCommandContext {
  cwd: string;
  signal?: AbortSignal;
  emitEffect: (effect: OsCommand) => void;
}

export interface TerminalCommandDefinition {
  name: string;
  aliases?: string[];
  usage: string;
  description: string;
  execute: (args: string[], context: TerminalCommandContext) => Promise<CommandResult>;
}

export interface TerminalPathResult {
  node: VfsNode;
  path: string;
}
