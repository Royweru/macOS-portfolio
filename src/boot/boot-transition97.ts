export const BOOT_TASKBAR_REVEAL_DELAY_MS = 300;
export const BOOT_ICON_REVEAL_START_MS = 600;
export const BOOT_ICON_REVEAL_STAGGER_MS = 90;
export const BOOT_WELCOME_DIALOG_DELAY_MS = 1600;

export const getBootIconRevealDelay97 = (index: number) =>
  BOOT_ICON_REVEAL_START_MS + Math.max(0, Math.trunc(index)) * BOOT_ICON_REVEAL_STAGGER_MS;

export const getBootWelcomeDelay97 = (reducedMotion: boolean) =>
  reducedMotion ? 0 : BOOT_WELCOME_DIALOG_DELAY_MS;
