import type { OpenWindowOptions } from '../os/os-store';

export interface RegisteredApp {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'system' | 'portfolio' | 'utility';
  canOpenMultiple: boolean;
  defaultWindow: Pick<OpenWindowOptions, 'rect'> & {
    width: number;
    height: number;
  };
  keywords: string[];
  fileExtensions?: string[];
  supportsTargets?: string[];
}

export const APP_REGISTRY: RegisteredApp[] = [
  {
    id: 'explorer',
    name: 'File Explorer',
    icon: 'folder',
    description: 'Browse the Weru OS portfolio filesystem.',
    category: 'system',
    canOpenMultiple: true,
    defaultWindow: { width: 900, height: 600 },
    keywords: ['files', 'folders', 'projects', 'documents'],
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: 'folder',
    description: 'Explore shipped portfolio projects.',
    category: 'portfolio',
    canOpenMultiple: false,
    defaultWindow: { width: 880, height: 580 },
    keywords: ['portfolio', 'work', 'github', 'case studies'],
  },
  {
    id: 'media-player',
    name: 'Weru Media Player 6.4',
    icon: 'media',
    description: 'Play project videos and audio inside Weru 97.',
    category: 'utility',
    canOpenMultiple: false,
    defaultWindow: { width: 820, height: 560 },
    keywords: ['video', 'audio', 'media', 'player', 'avi'],
    fileExtensions: ['.avi', '.mp4', '.webm', '.mp3', '.wav'],
  },
  {
    id: 'notepad',
    name: 'Notepad',
    icon: 'notepad',
    description: 'Read and edit portfolio text files.',
    category: 'utility',
    canOpenMultiple: true,
    defaultWindow: { width: 680, height: 500 },
    keywords: ['text', 'readme', 'resume', 'notes'],
    fileExtensions: ['.txt', '.md', '.json', '.log', '.ini'],
  },
  {
    id: 'ie4',
    name: 'Internet Explorer',
    icon: 'internet-explorer',
    description: 'Open portfolio links and case studies in the Weru 97 browser.',
    category: 'system',
    canOpenMultiple: true,
    defaultWindow: { width: 820, height: 560 },
    keywords: ['browser', 'internet', 'web', 'case study'],
    fileExtensions: ['.url', '.html', '.htm'],
  },
  {
    id: 'paint',
    name: 'Paint',
    icon: 'paint',
    description: 'View and annotate bitmap portfolio references.',
    category: 'utility',
    canOpenMultiple: true,
    defaultWindow: { width: 760, height: 560 },
    keywords: ['paint', 'bitmap', 'image', 'screenshots'],
    fileExtensions: ['.bmp', '.png', '.gif', '.jpg', '.jpeg'],
  },
  {
    id: 'cd-player',
    name: 'CD Player',
    icon: 'cd-player',
    description: 'Play the portfolio soundtrack and audio references.',
    category: 'utility',
    canOpenMultiple: false,
    defaultWindow: { width: 420, height: 360 },
    keywords: ['cd', 'music', 'audio', 'wav', 'midi'],
    fileExtensions: ['.wav', '.mid', '.midi'],
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'calculator',
    description: 'A period-correct desktop calculator.',
    category: 'utility',
    canOpenMultiple: false,
    defaultWindow: { width: 300, height: 380 },
    keywords: ['calculator', 'math'],
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    icon: 'minesweeper',
    description: 'The classic desktop game, rebuilt for Weru 97.',
    category: 'utility',
    canOpenMultiple: false,
    defaultWindow: { width: 320, height: 420 },
    keywords: ['game', 'minesweeper'],
  },
  {
    id: 'msdos',
    name: 'MS-DOS Prompt',
    icon: 'msdos',
    description: 'Explore the portfolio through a command prompt.',
    category: 'utility',
    canOpenMultiple: true,
    defaultWindow: { width: 720, height: 460 },
    keywords: ['dos', 'command', 'shell', 'terminal'],
  },
  {
    id: 'system-properties',
    name: 'About Me — System Properties',
    icon: 'system-properties',
    description: 'View Weru 97 system information and profile details.',
    category: 'system',
    canOpenMultiple: false,
    defaultWindow: { width: 460, height: 430 },
    keywords: ['system', 'properties', 'about', 'version'],
    fileExtensions: ['.spec'],
  },
  {
    id: 'control-panel',
    name: 'Control Panel',
    icon: 'control-panel',
    description: 'Configure the Weru 97 desktop experience.',
    category: 'system',
    canOpenMultiple: false,
    defaultWindow: { width: 640, height: 480 },
    keywords: ['settings', 'control panel', 'configuration'],
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'settings',
    description: 'Personalize the portfolio operating system.',
    category: 'system',
    canOpenMultiple: false,
    defaultWindow: { width: 820, height: 560 },
    keywords: ['theme', 'wallpaper', 'appearance', 'personalization'],
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'terminal',
    description: 'Discover portfolio commands and Easter eggs.',
    category: 'utility',
    canOpenMultiple: true,
    defaultWindow: { width: 720, height: 460 },
    keywords: ['shell', 'commands', 'cli', 'matrix'],
  },
  {
    id: 'photos',
    name: 'Photos',
    icon: 'photos',
    description: 'View project imagery and visual work.',
    category: 'portfolio',
    canOpenMultiple: false,
    defaultWindow: { width: 820, height: 560 },
    keywords: ['images', 'screenshots', 'design'],
  },
  {
    id: 'mail',
    name: 'Outlook Express',
    icon: 'mail',
    description: 'Send a message to Weru.',
    category: 'portfolio',
    canOpenMultiple: false,
    defaultWindow: { width: 640, height: 480 },
    keywords: ['contact', 'email', 'hire'],
  },
  {
    id: 'recycle-bin',
    name: 'Recycle Bin',
    icon: 'recycle',
    description: 'Restore or permanently remove deleted files.',
    category: 'system',
    canOpenMultiple: false,
    defaultWindow: { width: 720, height: 500 },
    keywords: ['trash', 'deleted', 'restore'],
  },
  { id: 'run', name: 'Run', icon: 'run', description: 'Launch a Weru 97 program by name.', category: 'system', canOpenMultiple: false, defaultWindow: { width: 430, height: 230 }, keywords: ['run', 'launch', 'program'] },
  { id: 'find', name: 'Find Files', icon: 'find', description: 'Search the virtual C: drive.', category: 'system', canOpenMultiple: false, defaultWindow: { width: 680, height: 460 }, keywords: ['find', 'search', 'files'] },
  { id: 'shutdown', name: 'Shut Down', icon: 'shutdown', description: 'Close or restart the Weru 97 session.', category: 'system', canOpenMultiple: false, defaultWindow: { width: 320, height: 240 }, keywords: ['shutdown', 'restart', 'power'] },
  { id: 'system-warning', name: 'System Warning', icon: 'system-properties', description: 'Confirm before exploring the portfolio projects.', category: 'system', canOpenMultiple: false, defaultWindow: { width: 340, height: 180 }, keywords: ['warning', 'projects', 'portfolio'] },
];

export const getRegisteredApp = (appId: string) => APP_REGISTRY.find(app => app.id === appId);

export const resolveAppForExtension = (filename: string) => {
  const normalized = filename.toLowerCase();
  return APP_REGISTRY.find((app) => app.fileExtensions?.some((extension) => normalized.endsWith(extension)));
};
