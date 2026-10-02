export const isBootSkipKey97 = (key: string) => key === 'Escape' || key === 'Enter' || key === ' ';

export type BootStage97 = 'bios' | 'starting' | 'logo' | 'done';

export const shouldFadeBootExit97 = (stage: BootStage97) => stage === 'logo';

/** Keep a completed splash visible while the desktop's IndexedDB state is still bootstrapping. */
export const getBootWaitingStage97 = (stage: BootStage97, animate: boolean): BootStage97 =>
  stage === 'logo' && animate ? 'logo' : 'starting';
