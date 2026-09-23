import projectsData from '../../data/projects_data.json';
import { APP_REGISTRY } from '../apps/app-registry';
import {
  createFolderNode,
  createTextFileNode,
  deleteNodeToTrash,
  getNode,
  listChildren,
  listTrash,
  restoreTrashEntry,
  resolveShortcut,
  searchNodes,
} from '../filesystem/filesystem-service';
import type { VfsNode } from '../filesystem/filesystem-types';
import type { OsCommand } from '../os/os-types';
import { targetForNode } from '../os/open-target';
import type { CommandResult, TerminalCommandContext, TerminalCommandDefinition, TerminalPathResult } from './terminal-types';
import { VIRTUAL_NODE_IDS, VIRTUAL_PATHS } from '../filesystem/virtual-paths';

const ROOT_ID = VIRTUAL_NODE_IDS.root;
const DEFAULT_CWD: string = VIRTUAL_PATHS.profile;

const line = (text: string, kind: CommandResult['lines'][number]['kind'] = 'output') => ({ text, kind });
const success = (text: string): CommandResult => ({ lines: [line(text, 'success')], exitCode: 0 });
const error = (text: string): CommandResult => ({ lines: [line(`weru: ${text}`, 'error')], exitCode: 1 });

const normalizeParts = (input: string) => input.replaceAll('/', '\\').split('\\').filter(Boolean).reduce<string[]>((parts, part) => {
  if (part === '.') return parts;
  if (part === '..') return parts.slice(0, -1);
  return [...parts, part];
}, []);

const pathFromParts = (parts: string[]) => `C:\\${parts.join('\\')}`;

async function nodeAtParts(parts: string[]): Promise<VfsNode | undefined> {
  let current = await getNode(ROOT_ID);
  if (!current) return undefined;
  for (const part of parts) {
    const child: VfsNode | undefined = (await listChildren(current.id)).find(node => node.name.toLowerCase() === part.toLowerCase());
    if (!child) return undefined;
    current = await resolveShortcut(child);
    if (!current) return undefined;
  }
  return current;
}

export async function resolveVirtualPath(input: string, cwd = DEFAULT_CWD): Promise<TerminalPathResult | undefined> {
  const source = input.trim() || cwd;
  const absolute = /^[a-z]:[\\/]/i.test(source) || /^c:$/i.test(source) || source.startsWith('\\');
  const cwdParts = normalizeParts(cwd).filter(part => !/^c:$/i.test(part));
  const sourceParts = normalizeParts(source).filter(part => !/^c:$/i.test(part));
  const parts = absolute ? sourceParts : [...cwdParts, ...sourceParts];
  const node = await nodeAtParts(parts);
  return node ? { node, path: pathFromParts(parts) } : undefined;
}

async function parentFor(input: string, cwd: string) {
  const normalized = input.replaceAll('/', '\\');
  const lastSeparator = normalized.lastIndexOf('\\');
  const name = normalized.slice(lastSeparator + 1);
  const parentInput = normalized.slice(0, lastSeparator) || '.';
  const parent = await resolveVirtualPath(parentInput, cwd);
  return { name, parent };
}

function effects(...effects: OsCommand[]): CommandResult { return { lines: [], effects, exitCode: 0 }; }

const definitions: TerminalCommandDefinition[] = [
  {
    name: 'help', usage: 'help [command]', description: 'List available sandbox commands.',
    async execute(args) {
      const command = definitions.find(item => item.name === args[0] || item.aliases?.includes(args[0]));
      if (command) return { lines: [line(`${command.usage} — ${command.description}`, 'info')], exitCode: 0 };
      return { lines: [line('Weru OS Terminal'), line('Filesystem: ls cd pwd tree cat open touch mkdir rm recycle restore trash find stat'), line('Portfolio: projects about experience skills contact resume github hire-weru'), line('OS: apps theme wallpaper settings neofetch systeminfo'), line('Easter eggs: matrix whoami fortune konami secret sudo hire-weru'), line('Use help <command> for command details.', 'info')], exitCode: 0 };
    },
  },
  { name: 'clear', aliases: ['cls'], usage: 'clear', description: 'Clear the terminal output.', async execute() { return { lines: [], exitCode: 0 }; } },
  { name: 'ver', usage: 'ver', description: 'Display the Weru 97 version.', execute: async () => success('Weru 97 [Version 4.0.0]') },
  { name: 'pwd', usage: 'pwd', description: 'Print the current virtual directory.', execute: async (_args, context) => success(context.cwd) },
  {
    name: 'ls', aliases: ['dir'], usage: 'ls [path]', description: 'List virtual files and folders.',
    execute: async (args, context) => {
      const result = await resolveVirtualPath(args[0] ?? '.', context.cwd);
      if (!result) return error(`path not found: ${args[0]}`);
      if (result.node.kind === 'file') return { lines: [line(result.node.name)], exitCode: 0 };
      const children = await listChildren(result.node.id);
      return { lines: children.filter(node => !node.isHidden).map(node => line(`${node.kind === 'folder' ? '<DIR> ' : '      '}${node.name}`)), exitCode: 0 };
    },
  },
  {
    name: 'cd', usage: 'cd <path>', description: 'Change the current virtual directory.',
    execute: async (args, context) => {
      if (!args[0]) return error('missing path. Usage: cd <path>');
      const result = await resolveVirtualPath(args[0], context.cwd);
      if (!result || result.node.kind !== 'folder') return error(`directory not found: ${args[0]}`);
      return { lines: [], nextCwd: result.path, exitCode: 0 };
    },
  },
  {
    name: 'tree', usage: 'tree [path]', description: 'Show a compact virtual directory tree.',
    execute: async (args, context) => {
      const result = await resolveVirtualPath(args[0] ?? '.', context.cwd);
      if (!result || result.node.kind !== 'folder') return error(`directory not found: ${args[0] ?? context.cwd}`);
      const lines: CommandResult['lines'] = [line(result.node.name, 'info')];
      const walk = async (node: VfsNode, prefix: string, depth: number) => {
        if (depth > 2) return;
        const children = (await listChildren(node.id)).filter(child => !child.isHidden);
        for (const [index, child] of children.entries()) {
          lines.push(line(`${prefix}${index === children.length - 1 ? '└─ ' : '├─ '}${child.name}`));
          if (child.kind === 'folder') await walk(child, `${prefix}${index === children.length - 1 ? '   ' : '│  '}`, depth + 1);
        }
      };
      await walk(result.node, '', 0);
      return { lines, exitCode: 0 };
    },
  },
  {
    name: 'cat', usage: 'cat <file>', description: 'Print a text file from the virtual filesystem.',
    execute: async (args, context) => {
      if (!args[0]) return error('missing file. Usage: cat <file>');
      const result = await resolveVirtualPath(args[0], context.cwd);
      if (!result || result.node.kind !== 'file') return error(`file not found: ${args[0]}`);
      if (result.node.media || !['text/plain', 'text/markdown', 'application/json', 'text/uri-list'].includes(result.node.mimeType)) return error(`${result.node.name} is not a text file`);
      return { lines: (result.node.content ?? '').split('\n').map(text => line(text)), exitCode: 0 };
    },
  },
  {
    name: 'open', usage: 'open <app|path>', description: 'Open a Weru OS application or virtual file.',
    execute: async (args, context) => {
      if (!args[0]) return error('missing application or path. Usage: open <app|path>');
      const app = APP_REGISTRY.find(item => item.id === args[0].toLowerCase() || item.name.toLowerCase() === args.join(' ').toLowerCase());
      if (app) return effects({ type: 'open-app', appId: app.id });
      const result = await resolveVirtualPath(args[0], context.cwd);
      if (!result) return error(`application or path not found: ${args.join(' ')}`);
      return { lines: [], effects: [{ type: 'open-target', target: targetForNode(result.node) }], exitCode: 0 };
    },
  },
  {
    name: 'mkdir', usage: 'mkdir <folder>', description: 'Create a folder in the virtual filesystem.',
    execute: async (args, context) => {
      if (!args[0]) return error('missing folder name. Usage: mkdir <folder>');
      const { name, parent } = await parentFor(args[0], context.cwd);
      if (!parent || parent.node.kind !== 'folder') return error(`parent directory not found: ${args[0]}`);
      if ((await listChildren(parent.node.id)).some(node => node.name.toLowerCase() === name.toLowerCase())) return error(`already exists: ${name}`);
      await createFolderNode(parent.node.id, name);
      return success(`created directory ${name}`);
    },
  },
  {
    name: 'touch', usage: 'touch <file>', description: 'Create an empty text file.',
    execute: async (args, context) => {
      if (!args[0]) return error('missing file name. Usage: touch <file>');
      const { name, parent } = await parentFor(args[0], context.cwd);
      if (!parent || parent.node.kind !== 'folder') return error(`parent directory not found: ${args[0]}`);
      if ((await listChildren(parent.node.id)).some(node => node.name.toLowerCase() === name.toLowerCase())) return error(`already exists: ${name}`);
      await createTextFileNode(parent.node.id, name);
      return success(`created file ${name}`);
    },
  },
  {
    name: 'rm', aliases: ['recycle'], usage: 'rm [--permanent] <path>', description: 'Move a virtual file or folder to Recycle Bin.',
    execute: async (args, context) => {
      const permanent = args.includes('--permanent');
      const target = args.filter(arg => arg !== '--permanent')[0];
      if (!target) return error('missing path. Usage: rm <path>');
      if (permanent) return { lines: [line('Permanent deletion is disabled in the terminal. Use Recycle Bin for explicit confirmation.', 'warning')], exitCode: 1 };
      const result = await resolveVirtualPath(target, context.cwd);
      if (!result || result.node.id === ROOT_ID) return error(`path not found or protected: ${target}`);
      await deleteNodeToTrash(result.node.id);
      return success(`moved ${result.node.name} to Recycle Bin`);
    },
  },
  {
    name: 'trash', usage: 'trash', description: 'List deleted virtual files.',
    execute: async () => {
      const entries = await listTrash();
      return { lines: entries.length ? entries.map(entry => line(`${entry.originalName} · deleted ${new Date(entry.deletedAt).toLocaleString()}`)) : [line('Recycle Bin is empty.', 'info')], exitCode: 0 };
    },
  },
  {
    name: 'restore', usage: 'restore <name>', description: 'Restore a Recycle Bin entry.',
    execute: async (args) => {
      const entries = await listTrash();
      const entry = entries.find(item => item.id === args[0] || item.originalName.toLowerCase() === args.join(' ').toLowerCase());
      if (!entry) return error(`Recycle Bin entry not found: ${args.join(' ')}`);
      await restoreTrashEntry(entry.id);
      return success(`restored ${entry.originalName}`);
    },
  },
  {
    name: 'find', usage: 'find <query>', description: 'Search virtual file and folder names.',
    execute: async (args) => {
      if (!args[0]) return error('missing query. Usage: find <query>');
      const nodes = await searchNodes(args.join(' '));
      return { lines: nodes.map(node => line(`${node.kind === 'folder' ? '<DIR> ' : ''}${node.name}`)), exitCode: 0 };
    },
  },
  {
    name: 'stat', usage: 'stat <path>', description: 'Show virtual file metadata.',
    execute: async (args, context) => {
      const result = await resolveVirtualPath(args[0] ?? '.', context.cwd);
      if (!result) return error(`path not found: ${args[0]}`);
      return { lines: [line(`Name: ${result.node.name}`), line(`Type: ${result.node.kind}`), line(`Size: ${result.node.size} bytes`), line(`Modified: ${result.node.updatedAt}`), line(`Path: ${result.path}`)], exitCode: 0 };
    },
  },
  {
    name: 'projects', usage: 'projects', description: 'Open the portfolio Projects workspace.',
    execute: async () => ({ lines: [line(`${projectsData.length} portfolio projects available. Opening Projects…`, 'success')], effects: [{ type: 'open-target', target: { kind: 'folder', nodeId: VIRTUAL_NODE_IDS.projects } }], exitCode: 0 }),
  },
  ...(['about', 'experience', 'skills', 'contact', 'resume', 'settings'] as const).map(name => ({
    name, usage: name, description: `Open ${name} in Weru OS.`,
    execute: async () => {
      const targets = {
        about: { kind: 'file', nodeId: 'file-about-me' },
        experience: { kind: 'file', nodeId: 'file-experience' },
        skills: { kind: 'file', nodeId: 'file-skills' },
        resume: { kind: 'file', nodeId: 'file-resume' },
        contact: { kind: 'application', appId: 'mail' },
        settings: { kind: 'application', appId: 'settings' },
      } as const;
      return { lines: [], effects: [{ type: 'open-target', target: targets[name] }], exitCode: 0 };
    },
  })),
  { name: 'github', usage: 'github', description: 'Open Weru’s GitHub profile.', execute: async () => ({ lines: [line('GitHub links are available from the portfolio workspace.', 'info')], effects: [{ type: 'open-target', target: { kind: 'folder', nodeId: VIRTUAL_NODE_IDS.projects } }], exitCode: 0 }) },
  { name: 'hire-weru', usage: 'hire-weru', description: 'Open the contact application.', execute: async () => ({ lines: [], effects: [{ type: 'open-target', target: { kind: 'application', appId: 'mail' } }], exitCode: 0 }) },
  { name: 'apps', usage: 'apps', description: 'List installed Weru OS applications.', execute: async () => ({ lines: APP_REGISTRY.map(app => line(`${app.id.padEnd(14)} ${app.description}`)), exitCode: 0 }) },
  { name: 'theme', usage: 'theme [theme-id]', description: 'Show or change the OS theme.', execute: async (args) => { if (!args[0]) return { lines: [line('Available themes: bloom-light, midnight', 'info')], exitCode: 0 }; if (!['bloom-light', 'midnight'].includes(args[0])) return error(`unknown theme: ${args[0]}`); return { lines: [line(`Theme set to ${args[0]}.`, 'success')], effects: [{ type: 'set-theme', themeId: args[0] }], exitCode: 0 }; } },
  { name: 'wallpaper', usage: 'wallpaper [wallpaper-id]', description: 'Show or change the OS wallpaper.', execute: async (args) => { if (!args[0]) return { lines: [line('Available wallpapers: bloom-light', 'info')], exitCode: 0 }; if (args[0] !== 'bloom-light') return error(`unknown wallpaper: ${args[0]}`); return { lines: [line(`Wallpaper set to ${args[0]}.`, 'success')], effects: [{ type: 'set-wallpaper', wallpaperId: args[0] }], exitCode: 0 }; } },
  { name: 'neofetch', usage: 'neofetch', description: 'Display Weru OS system information.', execute: async () => ({ lines: [line('        .--.       wer u@portfolio'), line('       |o_o |      ----------------'), line('       |:_/ |      OS: Weru OS'), line('      //   \\\\ \\    Shell: Weru Terminal'), line('     (|     | )    Runtime: Browser sandbox', 'system')], exitCode: 0 }) },
  { name: 'systeminfo', usage: 'systeminfo', description: 'Display browser-safe runtime information.', execute: async () => ({ lines: [line('Weru OS Portfolio Runtime', 'system'), line(`Viewport: ${typeof window === 'undefined' ? 'browser' : `${window.innerWidth}×${window.innerHeight}`}`), line('Storage: IndexedDB virtual filesystem'), line('Execution: sandboxed; host processes unavailable')], exitCode: 0 }) },
  { name: 'whoami', usage: 'whoami', description: 'Print the current Weru OS user.', execute: async () => success('Admin') },
  { name: 'fortune', usage: 'fortune', description: 'Print a small engineering fortune.', execute: async () => ({ lines: [line('A small interface, consistently finished, beats a large interface half-built.', 'info')], exitCode: 0 }) },
  { name: 'konami', usage: 'konami', description: 'Trigger a playful system response.', execute: async () => ({ lines: [line('↑ ↑ ↓ ↓ ← → ← → B A', 'system'), line('Developer mode acknowledged. Nice reflexes.', 'success')], exitCode: 0 }) },
  { name: 'secret', usage: 'secret', description: 'Find a hidden message.', execute: async () => ({ lines: [line('The best Easter egg is a portfolio that works.', 'success')], exitCode: 0 }) },
  { name: 'matrix', usage: 'matrix', description: 'Run the cancellable matrix Easter egg.', execute: async (_args, context) => { if (context.signal?.aborted) return { lines: [line('matrix cancelled', 'warning')], exitCode: 130 }; return { lines: [line('Wake up, Weru…', 'system'), line('The portfolio has you.', 'success'), line('Follow the white rabbit → Projects', 'info')], exitCode: 0 }; } },
  { name: 'sudo', usage: 'sudo hire-weru', description: 'A friendly hiring Easter egg.', execute: async (args) => args[0] === 'hire-weru' ? { lines: [line('Permission granted: Weru is open to great work.', 'success')], effects: [{ type: 'open-target', target: { kind: 'application', appId: 'mail' } }], exitCode: 0 } : error('sudo is limited to `sudo hire-weru` in Weru OS.') },
  { name: 'exit', usage: 'exit', description: 'Close the focused terminal window.', execute: async () => effects({ type: 'close-focused-window' }) },
  {
    name: 'crash',
    usage: 'crash',
    description: 'Trigger the Weru 97 recovery screen.',
    execute: async (_args, context) => {
      // Dispatch immediately as well as returning a result for command callers
      // that do not consume result effects. This keeps the recovery path
      // reliable when the terminal is replaced by the full-screen BSOD.
      context.emitEffect({ type: 'show-bsod' });
      return { lines: [], exitCode: 0 };
    },
  },
];

export const getCommandDefinitions = () => definitions;
export const getCommandNames = () => definitions.flatMap(command => [command.name, ...(command.aliases ?? [])]);

export async function executeTerminalCommand(parsed: { name: string; args: string[] } | null, context: TerminalCommandContext): Promise<CommandResult> {
  if (!parsed) return { lines: [], exitCode: 0 };
  const command = definitions.find(item => item.name === parsed.name || item.aliases?.includes(parsed.name));
  if (!command) return { lines: [line(`weru: command not found: ${parsed.name}`, 'error'), line('Try `help` to see available commands.', 'info')], exitCode: 127 };
  try { return await command.execute(parsed.args, context); }
  catch { return error(`could not complete ${parsed.name}; the virtual filesystem may be unavailable.`); }
}
