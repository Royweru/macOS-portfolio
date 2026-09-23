export const WIN97_ASSETS = {
  icons: {
    computer: '/assets/win97/icons/computer.svg',
    folder: '/assets/win97/icons/folder.svg',
    recycle: '/assets/win97/icons/recycle.svg',
    msdos: '/assets/win97/icons/msdos.svg',
    ie4: '/assets/win97/icons/ie4.svg',
    media: '/assets/win97/icons/media.svg',
    cd: '/assets/win97/icons/cd.svg',
    paint: '/assets/win97/icons/paint.svg',
    calculator: '/assets/win97/icons/calculator.svg',
    minesweeper: '/assets/win97/icons/minesweeper.svg',
    file: '/assets/win97/icons/file.svg',
    document: '/assets/win97/icons/document.svg',
    executable: '/assets/win97/icons/executable.svg',
    url: '/assets/win97/icons/url.svg',
    music: '/assets/win97/icons/music.svg',
    video: '/assets/win97/icons/video.svg',
    mail: '/assets/win97/icons/mail.svg',
    system: '/assets/win97/icons/system.svg',
  },
  cursors: {
    default: "/assets/win97/cursors/default.svg",
    pointer: "/assets/win97/cursors/pointer.svg",
    busy: "/assets/win97/cursors/busy.svg",
    hand: "/assets/win97/cursors/hand.svg",
    move: "/assets/win97/cursors/move.svg",
    ns: "/assets/win97/cursors/ns.svg",
    ew: "/assets/win97/cursors/ew.svg",
    nwse: "/assets/win97/cursors/nwse.svg",
    nesw: "/assets/win97/cursors/nesw.svg",
  },
  wallpaper: '/assets/win97/wallpaper/bliss.svg',
} as const;

export const WIN97_ASSET_MANIFEST = {
  wallpaper: {
    path: WIN97_ASSETS.wallpaper,
    source: 'Stitch desktop references and supplied Windows 97 icon sheet',
    rendering: 'cover with CSS scanlines; never duplicated inside app windows',
  },
  icons: {
    directory: '/assets/win97/icons',
    rendering: 'pixelated nearest-neighbor SVG rasterization',
    states: ['default', 'selected', 'disabled'] as const,
  },
  cursors: {
    directory: '/assets/win97/cursors',
    hotspots: {
      default: [0, 0],
      pointer: [7, 2],
      busy: [8, 8],
      hand: [7, 2],
      move: [12, 12],
      ns: [8, 8],
      ew: [8, 8],
      nwse: [8, 8],
      nesw: [8, 8],
    },
  },
  buckets: {
    boot: '/assets/win97/boot',
    apps: '/assets/win97/apps',
  },
} as const;

export type Win97IconName = keyof typeof WIN97_ASSETS.icons;
