export const isBootSkipKey97 = (key: string) => key === 'Escape' || key === 'Enter' || key === ' ';

export type BootStage97 = 'bios' | 'starting' | 'logo' | 'done';

export const shouldFadeBootExit97 = (stage: BootStage97) => stage === 'logo';
