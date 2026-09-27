import { create } from 'zustand';

interface CdAudioState97 {
  playing: boolean;
  eqActive: boolean;
  preampDb: number;
  bassDb: number;
  trebleDb: number;
  setPlaying: (playing: boolean) => void;
  setEqActive: (active: boolean) => void;
  setPreampDb: (value: number) => void;
  setBassDb: (value: number) => void;
  setTrebleDb: (value: number) => void;
}

/** Shared CD transport/EQ state lets the source's two sibling windows stay in sync. */
export const useCdAudioStore97 = create<CdAudioState97>(set => ({
  playing: false,
  eqActive: true,
  preampDb: 0,
  bassDb: 3,
  trebleDb: 4,
  setPlaying: playing => set({ playing }),
  setEqActive: eqActive => set({ eqActive }),
  setPreampDb: preampDb => set({ preampDb }),
  setBassDb: bassDb => set({ bassDb }),
  setTrebleDb: trebleDb => set({ trebleDb }),
}));
