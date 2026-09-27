export interface CdTrayState97 {
  open: boolean;
  status: 'Ready' | 'No Disc' | 'Tray Open';
}

export type CdTrayAction97 = 'eject' | 'close';

export function transitionCdTray97(state: CdTrayState97, action: CdTrayAction97): CdTrayState97 {
  if (action === 'eject') return { open: true, status: 'Tray Open' };
  return state.open ? { open: false, status: 'No Disc' } : state;
}
