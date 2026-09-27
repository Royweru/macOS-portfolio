import type { WindowRect } from '../../features/os/os-types';

const PLAYER_SIZE97 = { width: 540, height: 420 };
const EQUALIZER_SIZE97 = { width: 390, height: 360 };
const GAP97 = 24;
const TOP97 = 40;

/** Reproduces Stitch's centered, side-by-side desktop row and its narrow-screen wrap. */
export function getCdPlayerWindowRects97(viewportWidth: number): { player: WindowRect; equalizer: WindowRect } {
  const width = Math.max(240, viewportWidth);
  if (width >= 1024) {
    const pairWidth = PLAYER_SIZE97.width + GAP97 + EQUALIZER_SIZE97.width;
    const left = Math.max(0, Math.round((width - pairWidth) / 2));
    return {
      player: { x: left, y: TOP97, ...PLAYER_SIZE97 },
      equalizer: { x: left + PLAYER_SIZE97.width + GAP97, y: TOP97, ...EQUALIZER_SIZE97 },
    };
  }
  return {
    player: { x: Math.max(0, Math.round((width - PLAYER_SIZE97.width) / 2)), y: TOP97, ...PLAYER_SIZE97 },
    equalizer: { x: Math.max(0, Math.round((width - EQUALIZER_SIZE97.width) / 2)), y: TOP97 + PLAYER_SIZE97.height + GAP97, ...EQUALIZER_SIZE97 },
  };
}

export function getCdPlayerCompanionCloseIds97(closingAppId: string, windows: readonly { id: string; appId: string }[]): string[] {
  if (closingAppId !== 'cd-player') return [];
  return windows.filter(window => window.appId === 'cd-equalizer').map(window => window.id);
}

type CdCompanionApp97 = 'cd-player' | 'cd-equalizer';
type OpenCdWindow97 = (appId: CdCompanionApp97, options: {
  instanceId: string;
  title: string;
  rect: WindowRect;
  fileId?: string;
  allowMultiple: false;
  canMaximize: false;
  showMaximize?: boolean;
}) => void;

/** Opens the source's two sibling surfaces, with the CD deck focused above its equalizer. */
export function openCdPlayerPair97(openWindow: OpenCdWindow97, fileId?: string, viewportWidth = 1280): void {
  const rects = getCdPlayerWindowRects97(viewportWidth);
  openWindow('cd-equalizer', {
    instanceId: 'cd-equalizer',
    title: 'Now Playing - Graphic Equalizer',
    rect: rects.equalizer,
    allowMultiple: false,
    canMaximize: false,
    showMaximize: false,
  });
  openWindow('cd-player', {
    instanceId: 'cd-player',
    title: 'CD Player',
    rect: rects.player,
    fileId,
    allowMultiple: false,
    canMaximize: false,
  });
}
