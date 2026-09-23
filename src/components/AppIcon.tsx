import type { LucideIcon } from 'lucide-react';
import {
  BriefcaseBusiness,
  FolderOpen,
  FolderKanban,
  FileText,
  SquarePlay,
  Mail,
  Recycle,
  Terminal as TerminalIcon,
  UserRound,
  Wrench,
  Settings,
  Image,
  NotebookPen,
  Calculator,
  Globe,
  ImageIcon,
  Gamepad2,
  Disc3,
  SlidersHorizontal,
} from 'lucide-react';
import { WIN97_ASSETS } from '../data/win97-assets';

const ICONS: Record<string, LucideIcon> = {
  about: UserRound,
  projects: FolderKanban,
  'project-detail': FileText,
  'media-player': SquarePlay,
  experience: BriefcaseBusiness,
  skills: Wrench,
  contact: Mail,
  explorer: FolderOpen,
  'recycle-bin': Recycle,
  terminal: TerminalIcon,
  notepad: NotebookPen,
  settings: Settings,
  photos: Image,
  mail: Mail,
  'cd-player': Disc3,
  paint: ImageIcon,
  calculator: Calculator,
  minesweeper: Gamepad2,
  ie4: Globe,
  msdos: TerminalIcon,
  'system-properties': SlidersHorizontal,
  'control-panel': Settings,
  run: SquarePlay,
  find: Globe,
  shutdown: Settings,
};

const COLORS: Record<string, string> = {
  about: '#3f4f5f',
  projects: '#0067c0',
  'project-detail': '#0067c0',
  'media-player': '#0067c0',
  experience: '#3f4f5f',
  skills: '#3f4f5f',
  contact: '#3f4f5f',
  explorer: '#0067c0',
  'recycle-bin': '#5f5f5f',
  terminal: '#3f4f5f',
  notepad: '#3f4f5f',
  settings: '#3f4f5f',
  photos: '#0067c0',
  mail: '#3f4f5f',
  'cd-player': '#800000',
  paint: '#008000',
  calculator: '#000080',
  minesweeper: '#008080',
  ie4: '#000080',
  msdos: '#000000',
  'system-properties': '#000080',
  'control-panel': '#800000',
  run: '#000080',
  find: '#000080',
  shutdown: '#800000',
};

interface AppIconProps {
  appId: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const PIXEL_ASSETS: Record<string, string> = {
  computer: WIN97_ASSETS.icons.computer,
  explorer: WIN97_ASSETS.icons.folder,
  media: WIN97_ASSETS.icons.media,
  'internet-explorer': WIN97_ASSETS.icons.ie4,
  folder: WIN97_ASSETS.icons.folder,
  'recycle-bin': WIN97_ASSETS.icons.recycle,
  recycle: WIN97_ASSETS.icons.recycle,
  msdos: WIN97_ASSETS.icons.msdos,
  terminal: WIN97_ASSETS.icons.msdos,
  ie4: WIN97_ASSETS.icons.ie4,
  'media-player': WIN97_ASSETS.icons.media,
  'cd-player': WIN97_ASSETS.icons.cd,
  paint: WIN97_ASSETS.icons.paint,
  calculator: WIN97_ASSETS.icons.calculator,
  minesweeper: WIN97_ASSETS.icons.minesweeper,
  document: WIN97_ASSETS.icons.document,
  file: WIN97_ASSETS.icons.file,
  'project-detail': WIN97_ASSETS.icons.document,
  projects: WIN97_ASSETS.icons.folder,
  paintbrush: WIN97_ASSETS.icons.paint,
  notepad: WIN97_ASSETS.icons.document,
  'system-properties': WIN97_ASSETS.icons.system,
  'control-panel': WIN97_ASSETS.icons.system,
  settings: WIN97_ASSETS.icons.system,
  run: WIN97_ASSETS.icons.executable,
  find: WIN97_ASSETS.icons.url,
  shutdown: WIN97_ASSETS.icons.system,
  photos: WIN97_ASSETS.icons.paint,
  music: WIN97_ASSETS.icons.music,
  video: WIN97_ASSETS.icons.video,
  videos: WIN97_ASSETS.icons.video,
  game: WIN97_ASSETS.icons.minesweeper,
  games: WIN97_ASSETS.icons.minesweeper,
};

export default function AppIcon({ appId, size = 18, className, strokeWidth = 1.8 }: AppIconProps) {
  const pixelAsset = PIXEL_ASSETS[appId];
  if (pixelAsset) return <img src={pixelAsset} width={size} height={size} className={className} style={{ imageRendering: 'pixelated', objectFit: 'contain' }} alt="" aria-hidden="true" />;
  const Icon = ICONS[appId] ?? FolderOpen;
  return <Icon size={size} strokeWidth={strokeWidth} color={COLORS[appId] ?? '#000080'} className={className} aria-hidden="true" />;
}
