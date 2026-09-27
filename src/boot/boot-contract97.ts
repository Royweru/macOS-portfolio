export const BIOS_LINES = [
  'PENTIUM-MMX CPU at 233MHz',
  'Memory Test',
  'Award Plug and Play BIOS Extension v1.0A',
  'Initialize Plug and Play Cards...',
  'PNP Init Completed',
  'Detecting Primary Master ... QUANTUM FIREBALL ST3.2A',
  'Detecting Primary Slave  ... ATAPI CD-ROM 24X MAX',
  'Detecting Secondary Master ... None',
  'Verifying DMI Pool Data .....................',
  'Booting from C:\\ drive...',
];

export const BIOS_LINE_DELAYS = [100, 230, 930, 1060, 1190, 1320, 1450, 1580, 1710, 1840];
export const BIOS_MEMORY_TARGET = 65536;
export const BIOS_MEMORY_STEP = 8192;
export const BOOT_BIOS_STAGE_MS = 2100;
export const BOOT_STARTING_STAGE_MS = 900;
export const BOOT_PROGRESS_SEGMENT_COUNT = 18;
export const BOOT_PROGRESS_INTERVAL_MS = 120;
export const BOOT_DESKTOP_REVEAL_DELAY_MS = 350;
// Stitch's CSS fades for 800ms, while its original script removes the splash
// at 700ms. Wait for the authored visual transition to finish in Weru 97.
export const BOOT_SPLASH_FADE_MS = 800;
