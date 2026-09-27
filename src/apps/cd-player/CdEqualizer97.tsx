'use client';

import { useEffect, useState } from 'react';
import { useOsStore } from '../../features/os/os-store';
import { useReducedMotion97 } from '../../hooks/useReducedMotion97';
import Button95 from '../../components/win95/Button95';
import { useCdAudioStore97 } from './cd-audio-store97';

const BANDS = ['60Hz', '150', '400', '1kHz', '3kHz', '6kHz', '14k'];
const START_LEVELS = [8, 6, 9, 5, 7, 8, 4];
const PRESETS = {
  Flat: [0, 0, 0],
  Rock: [1, 5, 3],
  Jazz: [0, 3, 4],
  Classical: [1, 2, 3],
  Pop: [2, 3, 2],
} as const;

type Preset97 = keyof typeof PRESETS;

export default function CdEqualizer97() {
  const [bars, setBars] = useState(START_LEVELS);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const playing = useCdAudioStore97(state => state.playing);
  const eqActive = useCdAudioStore97(state => state.eqActive);
  const preampDb = useCdAudioStore97(state => state.preampDb);
  const bassDb = useCdAudioStore97(state => state.bassDb);
  const trebleDb = useCdAudioStore97(state => state.trebleDb);
  const setEqActive = useCdAudioStore97(state => state.setEqActive);
  const setPreampDb = useCdAudioStore97(state => state.setPreampDb);
  const setBassDb = useCdAudioStore97(state => state.setBassDb);
  const setTrebleDb = useCdAudioStore97(state => state.setTrebleDb);
  const osReducedMotion = useOsStore(state => state.settings.reducedMotion);
  const reducedMotion = useReducedMotion97(osReducedMotion);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setInterval(() => setBars(current => current.map((_, index) => playing ? 3 + Math.floor(Math.random() * 7) : START_LEVELS[index])), 120);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const applyPreset = (preset: Preset97) => {
    const [preamp, bass, treble] = PRESETS[preset];
    setPreampDb(preamp);
    setBassDb(bass);
    setTrebleDb(treble);
    setEqActive(true);
    setPresetsOpen(false);
  };

  const resetEqualizer = () => {
    setPreampDb(0);
    setBassDb(0);
    setTrebleDb(0);
    setEqActive(true);
  };

  return <div className="win97-app win97-cd-eq-app" aria-label="Graphic Equalizer controls">
    <div className="win97-cd-eq-meta">PCM WAV AUDIO <span>16-Bit Stereo · 44,100 Hz</span></div>
    <div className="win97-cd-eq-bars" aria-label={playing ? 'Audio spectrum active' : 'Audio spectrum idle'}>
      <div className="win97-cd-eq-spectrum-head"><b>PEAK METER +3dB</b><b>REALTIME FFT</b></div>
      <div className="win97-cd-eq-bands">
        {bars.map((level, bandIndex) => <div className="win97-cd-eq-band" key={BANDS[bandIndex]}>
          <div className="win97-cd-eq-stack" role="meter" aria-label={`${BANDS[bandIndex]} spectrum`} aria-valuemin={0} aria-valuemax={9} aria-valuenow={eqActive ? level : 0}>
            {Array.from({ length: 9 }, (_, segmentIndex) => {
              const tone = segmentIndex === 0 ? 'peak' : segmentIndex < 3 ? 'warning' : 'signal';
              const active = eqActive && segmentIndex >= 9 - level;
              return <span key={segmentIndex} className={`win97-cd-eq-segment ${tone}${active ? ' active' : ''}`} />;
            })}
          </div>
          <small>{BANDS[bandIndex]}</small>
        </div>)}
      </div>
    </div>
    <div className="win97-cd-eq-sliders">
      <label>PREAMP<input aria-label="Equalizer preamp" type="range" min="-12" max="12" value={preampDb} onChange={event => setPreampDb(Number(event.target.value))} /><output>{preampDb > 0 ? '+' : ''}{preampDb} dB</output></label>
      <label>BASS<input aria-label="Equalizer bass" type="range" min="-12" max="12" value={bassDb} onChange={event => setBassDb(Number(event.target.value))} /><output>{bassDb > 0 ? '+' : ''}{bassDb} dB</output></label>
      <label>TREBLE<input aria-label="Equalizer treble" type="range" min="-12" max="12" value={trebleDb} onChange={event => setTrebleDb(Number(event.target.value))} /><output>{trebleDb > 0 ? '+' : ''}{trebleDb} dB</output></label>
    </div>
    <div className="win97-cd-eq-actions">
      <div className="win97-cd-presets">
        <Button95 size="sm" aria-haspopup="menu" aria-expanded={presetsOpen} onClick={() => setPresetsOpen(value => !value)}>Presets</Button95>
        {presetsOpen && <div className="win97-cd-preset-menu" role="menu" aria-label="Equalizer presets">{(Object.keys(PRESETS) as Preset97[]).map(preset => <button type="button" role="menuitem" key={preset} onClick={() => applyPreset(preset)}>{preset}</button>)}</div>}
      </div>
      <Button95 size="sm" onClick={resetEqualizer}>Reset</Button95>
      <label><input aria-label="Equalizer active" type="checkbox" checked={eqActive} onChange={event => setEqActive(event.target.checked)} /> EQ Active</label>
    </div>
    <footer>DSP Processor: Yamaha OPL3-SAx · DIRECTSOUND</footer>
  </div>;
}
