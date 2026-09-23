'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject, SyntheticEvent } from 'react';
import Button95 from '../../components/win95/Button95';
import type { MediaAsset } from '../../features/media/media-types';
import { adjacentMediaAsset, buildPlayableMediaList, formatMediaDuration, mediaAssetFilename, mediaAssetKey } from '../../features/media/media-playlist';
import { useReducedMotion97 } from '../../hooks/useReducedMotion97';
import { useOsStore } from '../../features/os/os-store';
import { applyCdAudioSettings97, createCdAudioEffectsGraph97, disconnectCdAudioEffects97, type CdAudioEffectsGraph97 } from './audio-effects97';

const TRACKS = [
  { name: '01_portfolio-theme.wav', length: '03:42', title: 'Portfolio Theme (Original Mix)' },
  { name: '02_ui-sounds-demo.mid', length: '01:15', title: 'Weru UI Sounds Demo' },
  { name: '03_startup-mix.wav', length: '02:50', title: 'Startup Mix' },
];

interface CdPlayer97Props {
  asset?: MediaAsset;
  availableAssets?: MediaAsset[];
}

export default function CdPlayer97({ asset, availableAssets = [] }: CdPlayer97Props) {
  const audio = useRef<HTMLAudioElement>(null);
  const playlist = useMemo(() => buildPlayableMediaList(availableAssets, asset).filter(item => item.kind === 'audio'), [availableAssets, asset]);
  const initialTrack = asset?.kind === 'audio' ? asset : playlist[0];
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [bars, setBars] = useState([20, 36, 18, 48, 27, 42, 22]);
  const [selectedKey, setSelectedKey] = useState<string | null>(() => initialTrack ? mediaAssetKey(initialTrack) : null);
  const [duration, setDuration] = useState(initialTrack?.durationSeconds ?? 0);
  const [status, setStatus] = useState(initialTrack ? 'Ready' : 'No Disc');
  const [volume, setVolume] = useState(0.85);
  const [balance, setBalance] = useState(0);
  const [timeMode, setTimeMode] = useState<'elapsed' | 'remain' | 'disc'>('elapsed');
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(true);
  const [intro, setIntro] = useState(false);
  const [eqActive, setEqActive] = useState(true);
  const [preampDb, setPreampDb] = useState(0);
  const [bassDb, setBassDb] = useState(3);
  const [trebleDb, setTrebleDb] = useState(4);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const effectsGraph = useRef<CdAudioEffectsGraph97 | null>(null);
  const effectsElement = useRef<HTMLAudioElement | null>(null);
  const appReducedMotion = useOsStore(state => state.settings.reducedMotion);
  const reducedMotion = useReducedMotion97(appReducedMotion);
  const trackIndex = playlist.findIndex(item => mediaAssetKey(item) === selectedKey);
  const selectedAsset = playlist.find(item => mediaAssetKey(item) === selectedKey);
  const totalDuration = playlist.reduce((sum, item) => sum + (item.durationSeconds ?? 0), 0);
  const displayedTime = timeMode === 'elapsed' ? elapsed : timeMode === 'remain' ? Math.max(0, duration - elapsed) : Math.max(0, totalDuration - elapsed);
  const introAdvanced = useRef(false);

  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume, selectedKey]);

  useEffect(() => {
    if (!effectsGraph.current) return;
    applyCdAudioSettings97(effectsGraph.current, { balance, preampDb, bassDb, trebleDb, enabled: eqActive });
  }, [balance, preampDb, bassDb, trebleDb, eqActive]);

  useEffect(() => () => {
    if (effectsGraph.current) disconnectCdAudioEffects97(effectsGraph.current);
    if (audioContext.current && audioContext.current.state !== 'closed') void audioContext.current.close();
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setInterval(() => setBars(current => current.map(() => playing ? 12 + Math.floor(Math.random() * 52) : 8)), 120);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const stop = () => {
    if (audio.current) { audio.current.pause(); try { audio.current.currentTime = 0; } catch { /* Metadata may not be ready. */ } }
    setElapsed(0); setPlaying(false); setStatus(selectedAsset ? 'Stopped' : 'No Disc');
  };

  const releaseAudioEffects = () => {
    if (effectsGraph.current) disconnectCdAudioEffects97(effectsGraph.current);
    effectsGraph.current = null;
    effectsElement.current = null;
  };

  const prepareAudioEffects = (element: HTMLAudioElement) => {
    const sourceUrl = element.currentSrc || element.src;
    if (!sourceUrl || new URL(sourceUrl, window.location.href).origin !== window.location.origin) return;
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    const context = audioContext.current ?? new AudioContextConstructor();
    audioContext.current = context;
    if (effectsElement.current !== element || !effectsGraph.current) {
      releaseAudioEffects();
      try {
        effectsGraph.current = createCdAudioEffectsGraph97(context, context.createMediaElementSource(element));
        effectsElement.current = element;
      } catch {
        // Keep native playback working if this browser cannot connect the element to Web Audio.
        return;
      }
    }
    applyCdAudioSettings97(effectsGraph.current, { balance, preampDb, bassDb, trebleDb, enabled: eqActive });
    if (context.state === 'suspended') void context.resume().catch(() => undefined);
  };

  const selectTrack = (nextAsset: MediaAsset | null) => {
    if (audio.current) { audio.current.pause(); try { audio.current.currentTime = 0; } catch { /* The new source starts from the beginning. */ } }
    if (!nextAsset || mediaAssetKey(nextAsset) !== selectedKey) releaseAudioEffects();
    introAdvanced.current = false;
    setSelectedKey(nextAsset ? mediaAssetKey(nextAsset) : null);
    setElapsed(0);
    setDuration(nextAsset?.durationSeconds ?? 0);
    setPlaying(false);
    setStatus(nextAsset ? 'Ready' : 'No Disc');
  };

  const toggle = () => {
    const element = audio.current;
    if (!selectedAsset || !element) { setStatus('No Disc'); return; }
    if (element.paused) {
      prepareAudioEffects(element);
      void element.play().then(() => { setPlaying(true); setStatus('Playing'); }).catch(() => { setPlaying(false); setStatus('Media unavailable'); });
    } else { element.pause(); setPlaying(false); setStatus('Paused'); }
  };

  const cycleTrack = (direction: -1 | 1) => {
    let next = adjacentMediaAsset(playlist, selectedKey, direction);
    if (shuffle && playlist.length > 1) {
      const alternatives = playlist.filter(item => mediaAssetKey(item) !== selectedKey);
      next = alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    if (next) selectTrack(next);
    else setStatus(playlist.length ? 'Only one track in playlist' : 'No Disc');
  };

  const seekBy = (offset: number) => {
    const element = audio.current;
    if (!element || !selectedAsset) return;
    const nextTime = Math.max(0, Math.min(element.duration || duration, element.currentTime + offset));
    try { element.currentTime = nextTime; setElapsed(nextTime); } catch { setStatus('Waiting for track metadata'); }
  };

  const onTimeUpdate = (event: SyntheticEvent<HTMLAudioElement>) => {
    const time = event.currentTarget.currentTime;
    setElapsed(time);
    if (intro && !introAdvanced.current && time >= 10 && playlist.length > 1) {
      introAdvanced.current = true;
      cycleTrack(1);
    }
  };

  const onMetadata = (event: SyntheticEvent<HTMLAudioElement>) => {
    const nextDuration = Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0;
    setDuration(nextDuration);
  };

  const onEnded = () => {
    if (shuffle && playlist.length > 1) cycleTrack(1);
    else { setPlaying(false); setStatus('Playback complete'); }
  };

  const resetEqualizer = () => {
    setPreampDb(0);
    setBassDb(0);
    setTrebleDb(0);
    setEqActive(true);
  };

  const applyPreset = (preset: 'Flat' | 'Rock' | 'Jazz' | 'Classical' | 'Pop') => {
    const settings: Record<typeof preset, [number, number, number]> = {
      Flat: [0, 0, 0], Rock: [1, 5, 3], Jazz: [0, 3, 4], Classical: [1, 2, 3], Pop: [2, 3, 2],
    };
    const [nextPreamp, nextBass, nextTreble] = settings[preset];
    setPreampDb(nextPreamp);
    setBassDb(nextBass);
    setTrebleDb(nextTreble);
    setEqActive(true);
    setPresetsOpen(false);
  };

  return <div className="win97-app win97-cd-player">
    <div className="win95-menubar"><button type="button">Disc</button><button type="button">View</button><button type="button">Options</button><button type="button">Help</button></div>
    <div className="win97-cd-layout">
      <section className="win97-cd-deck" aria-label="CD Player">
        <div className="win97-cd-lcd"><span>● {playing ? 'PLAYING DISC (D:)' : selectedAsset ? `${status.toUpperCase()} (D:)` : 'NO DISC (D:)'}</span><strong>[{String(Math.max(0, trackIndex + 1)).padStart(2, '0')}] {formatMediaDuration(displayedTime)}</strong><small>MODE: {timeMode === 'elapsed' ? 'TRACK TIME' : timeMode === 'remain' ? 'TRACK REMAIN' : 'DISC REMAIN'} <b>STEREO 44.1K</b></small></div>
        <div className="win97-cd-modes">
          <label><input type="radio" checked={timeMode === 'elapsed'} onChange={() => setTimeMode('elapsed')} /> Track Elapsed</label>
          <label><input type="radio" checked={timeMode === 'remain'} onChange={() => setTimeMode('remain')} /> Track Remain</label>
          <label><input type="radio" checked={timeMode === 'disc'} onChange={() => setTimeMode('disc')} /> Disc Remain</label>
        </div>
        <div className="win97-toolbar win97-cd-controls"><Button95 size="sm" aria-label="Previous track" disabled={playlist.length < 2} onClick={() => cycleTrack(-1)}>|◀</Button95><Button95 size="sm" aria-label="Fast reverse" disabled={!selectedAsset} onClick={() => seekBy(-10)}>◀◀</Button95><Button95 size="sm" aria-label="Play" disabled={!selectedAsset} pressed={playing} onClick={toggle}>▶</Button95><Button95 size="sm" aria-label="Pause" disabled={!selectedAsset} onClick={() => { audio.current?.pause(); setPlaying(false); setStatus('Paused'); }}>❚❚</Button95><Button95 size="sm" aria-label="Stop" disabled={!selectedAsset} onClick={stop}>■</Button95><Button95 size="sm" aria-label="Fast forward" disabled={!selectedAsset} onClick={() => seekBy(10)}>▶▶</Button95><Button95 size="sm" aria-label="Next track" disabled={playlist.length < 2} onClick={() => cycleTrack(1)}>▶|</Button95><Button95 size="sm" aria-label="Eject" disabled={!selectedAsset} onClick={() => selectTrack(null)}>⏏</Button95></div>
        <div className="win97-cd-fields"><label>Artist <select defaultValue="Music Library <C:\Music>"><option>Music Library &lt;C:\Music&gt;</option></select></label><label>Title <select value={selectedKey ?? ''} onChange={event => selectTrack(playlist.find(item => mediaAssetKey(item) === event.target.value) ?? null)} disabled={!playlist.length}><option value="">No Disc</option>{playlist.map(item => <option key={mediaAssetKey(item)} value={mediaAssetKey(item)}>{item.title}</option>)}</select></label><label>Track <select value={selectedKey ?? ''} onChange={event => selectTrack(playlist.find(item => mediaAssetKey(item) === event.target.value) ?? null)} disabled={!playlist.length}><option value="">No Disc</option>{playlist.map((item, index) => <option key={mediaAssetKey(item)} value={mediaAssetKey(item)}>{`[${index + 1}] ${mediaAssetFilename(item)} (${formatMediaDuration(item.durationSeconds)})`}</option>)}</select></label></div>
        {!selectedAsset && <div className="sunken win97-empty-media">No playable tracks loaded. Add audio to C:\Music or open a track from Explorer.</div>}
        {selectedAsset && <audio key={selectedKey ?? undefined} ref={audio as RefObject<HTMLAudioElement>} preload="metadata" src={selectedAsset.source} loop={repeat && !shuffle} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onMetadata} onEnded={onEnded} onError={() => { setPlaying(false); setStatus('Media unavailable'); }} />}
        <div className="win97-cd-playlist" aria-label="Track list">{playlist.length > 0 ? playlist.map((item, index) => <button type="button" key={mediaAssetKey(item)} className={mediaAssetKey(item) === selectedKey ? 'selected' : ''} onClick={() => selectTrack(item)}>{`[${String(index + 1).padStart(2, '0')}] ${mediaAssetFilename(item)}`}<span>{formatMediaDuration(item.durationSeconds)}</span></button>) : TRACKS.map((item, index) => <button type="button" key={item.name} disabled title="Reference-layout sample only. Add a real track to C:\Music to enable playback.">{`[${String(index + 1).padStart(2, '0')}] ${item.name}`}<span>{item.length}</span></button>)}</div>
        <div className="win97-cd-mix"><label>Volume <input aria-label="CD volume" type="range" min="0" max="1" step=".05" value={volume} onChange={event => setVolume(Number(event.target.value))} /></label><label>Balance <input aria-label="CD balance" type="range" min="-1" max="1" step=".1" value={balance} onChange={event => setBalance(Number(event.target.value))} /></label><span>{balance === 0 ? 'C' : balance < 0 ? 'L' : 'R'}</span></div>
        <div className="win97-cd-toggles"><Button95 size="sm" pressed={shuffle} onClick={() => setShuffle(value => !value)}>Rand</Button95><Button95 size="sm" pressed={repeat} onClick={() => setRepeat(value => !value)}>Cont</Button95><Button95 size="sm" pressed={intro} onClick={() => { introAdvanced.current = false; setIntro(value => !value); }}>Intro</Button95><small>Total Play: {formatMediaDuration(totalDuration)} · Track: {formatMediaDuration(duration)} · CD-ROM (D:) {selectedAsset ? 'Ready' : 'No Disc'}</small></div>
      </section>
      <aside className="win97-cd-eq-window" aria-label="Graphic Equalizer">
        <header>▥ Now Playing - Graphic Equalizer</header>
        <div className="win97-cd-eq-meta">PCM WAV AUDIO <span>16-Bit Stereo · 44,100 Hz</span></div>
        <div className="win97-cd-eq-bars">{bars.map((height, index) => <div key={index}><span style={{ height: eqActive ? `${height}%` : '8%' }} /><small>{['60Hz', '150', '400', '1kHz', '3kHz', '6kHz', '14k'][index]}</small></div>)}</div>
        <div className="win97-cd-eq-sliders">
          <label>PREAMP<input aria-label="Equalizer preamp" type="range" min="-12" max="12" value={preampDb} onChange={event => setPreampDb(Number(event.target.value))} /></label>
          <label>BASS<input aria-label="Equalizer bass" type="range" min="-12" max="12" value={bassDb} onChange={event => setBassDb(Number(event.target.value))} /></label>
          <label>TREBLE<input aria-label="Equalizer treble" type="range" min="-12" max="12" value={trebleDb} onChange={event => setTrebleDb(Number(event.target.value))} /></label>
        </div>
        <div className="win97-cd-eq-actions">
          <div className="win97-cd-presets">
            <Button95 size="sm" aria-haspopup="menu" aria-expanded={presetsOpen} onClick={() => setPresetsOpen(value => !value)}>Presets</Button95>
            {presetsOpen && <div className="win97-cd-preset-menu" role="menu" aria-label="Equalizer presets">{(['Flat', 'Rock', 'Jazz', 'Classical', 'Pop'] as const).map(preset => <button type="button" role="menuitem" key={preset} onClick={() => applyPreset(preset)}>{preset}</button>)}</div>}
          </div>
          <Button95 size="sm" onClick={resetEqualizer}>Reset</Button95>
          <label><input type="checkbox" checked={eqActive} onChange={event => setEqActive(event.target.checked)} /> EQ Active</label>
        </div>
        <footer>DSP Processor: Yamaha OPL3-SAx · DIRECTSOUND</footer>
      </aside>
    </div>
  </div>;
}
