'use client';

import { useEffect, useRef, useState } from 'react';
import Button95 from '../../components/win95/Button95';
import type { MediaAsset } from '../../features/media/media-types';
import { useReducedMotion97 } from '../../hooks/useReducedMotion97';
import { useOsStore } from '../../features/os/os-store';

const TRACKS = [
  { name: '01_portfolio-theme.wav', length: '03:42', title: 'Portfolio Theme (Original Mix)' },
  { name: '02_ui-sounds-demo.mid', length: '01:15', title: 'Weru UI Sounds Demo' },
  { name: '03_startup-mix.wav', length: '02:50', title: 'Startup Mix' },
];

const formatTime = (value: number) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

export default function CdPlayer97({ asset }: { asset?: MediaAsset }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [bars, setBars] = useState([20, 36, 18, 48, 27, 42, 22]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [status, setStatus] = useState(asset ? 'Ready' : 'No Disc');
  const [volume, setVolume] = useState(0.85);
  const [balance, setBalance] = useState(0);
  const [timeMode, setTimeMode] = useState<'elapsed' | 'remain' | 'disc'>('elapsed');
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(true);
  const [intro, setIntro] = useState(false);
  const [eqActive, setEqActive] = useState(true);
  const appReducedMotion = useOsStore(state => state.settings.reducedMotion);
  const reducedMotion = useReducedMotion97(appReducedMotion);
  const selectedTrack = TRACKS[trackIndex];

  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    const tick = () => setElapsed(element.currentTime);
    const ended = () => { setPlaying(false); setStatus('Playback complete'); };
    const failed = () => { setPlaying(false); setStatus('Media unavailable'); };
    element.addEventListener('timeupdate', tick);
    element.addEventListener('ended', ended);
    element.addEventListener('error', failed);
    if (reducedMotion) return () => { element.removeEventListener('timeupdate', tick); element.removeEventListener('ended', ended); element.removeEventListener('error', failed); };
    const timer = window.setInterval(() => setBars(current => current.map(() => playing ? 12 + Math.floor(Math.random() * 52) : 8)), 120);
    return () => { element.removeEventListener('timeupdate', tick); element.removeEventListener('ended', ended); element.removeEventListener('error', failed); window.clearInterval(timer); };
  }, [playing, asset, reducedMotion]);

  const stop = () => {
    if (audio.current) { audio.current.pause(); audio.current.currentTime = 0; }
    setElapsed(0); setPlaying(false); setStatus(asset ? 'Stopped' : 'No Disc');
  };
  const toggle = () => {
    const element = audio.current;
    if (!element) { setStatus('No Disc'); return; }
    if (element.paused) {
      void element.play().then(() => { setPlaying(true); setStatus('Playing'); }).catch(() => { setPlaying(false); setStatus('Media unavailable'); });
    } else { element.pause(); setPlaying(false); setStatus('Paused'); }
  };
  const cycleTrack = (direction: number) => { setTrackIndex(index => (index + direction + TRACKS.length) % TRACKS.length); stop(); };
  const displayedTime = timeMode === 'elapsed' ? elapsed : timeMode === 'remain' ? Math.max(0, 222 - elapsed) : Math.max(0, 467 - elapsed);

  return <div className="win97-app win97-cd-player">
    <div className="win95-menubar"><button type="button">Disc</button><button type="button">View</button><button type="button">Options</button><button type="button">Help</button></div>
    <div className="win97-cd-layout">
      <section className="win97-cd-deck" aria-label="CD Player">
        <div className="win97-cd-lcd"><span>● {playing ? 'PLAYING DISC (D:)' : asset ? `${status.toUpperCase()} (D:)` : 'NO DISC (D:)'}</span><strong>[{String(trackIndex + 1).padStart(2, '0')}] {formatTime(displayedTime)}</strong><small>MODE: TRACK TIME <b>STEREO 44.1K</b></small></div>
        <div className="win97-cd-modes">
          <label><input type="radio" checked={timeMode === 'elapsed'} onChange={() => setTimeMode('elapsed')} /> Track Elapsed</label>
          <label><input type="radio" checked={timeMode === 'remain'} onChange={() => setTimeMode('remain')} /> Track Remain</label>
          <label><input type="radio" checked={timeMode === 'disc'} onChange={() => setTimeMode('disc')} /> Disc Remain</label>
        </div>
        <div className="win97-toolbar win97-cd-controls"><Button95 size="sm" aria-label="Previous track" onClick={() => cycleTrack(-1)}>|◀</Button95><Button95 size="sm" aria-label="Fast reverse">◀◀</Button95><Button95 size="sm" aria-label="Play" onClick={toggle}>▶</Button95><Button95 size="sm" aria-label="Pause" onClick={() => { audio.current?.pause(); setPlaying(false); }}>❚❚</Button95><Button95 size="sm" aria-label="Stop" onClick={stop}>■</Button95><Button95 size="sm" aria-label="Fast forward">▶▶</Button95><Button95 size="sm" aria-label="Next track" onClick={() => cycleTrack(1)}>▶|</Button95><Button95 size="sm" aria-label="Eject">⏏</Button95></div>
        <div className="win97-cd-fields"><label>Artist <select defaultValue="My Music <D:\\AUDIO_CD>"><option>My Music &lt;D:\\AUDIO_CD&gt;</option></select></label><label>Title <select value={selectedTrack.title} onChange={event => setTrackIndex(Math.max(0, TRACKS.findIndex(item => item.title === event.target.value)))}>{TRACKS.map(item => <option key={item.title}>{item.title}</option>)}</select></label><label>Track <select value={selectedTrack.name} onChange={event => setTrackIndex(TRACKS.findIndex(item => item.name === event.target.value))}>{TRACKS.map((item, index) => <option key={item.name}>{`[${index + 1}] ${item.name} (${item.length})`}</option>)}</select></label></div>
        {!asset && <div className="sunken win97-empty-media">Insert an audio asset from C:\Windows\Media to play it.</div>}
        {asset && <audio ref={audio} preload="metadata" src={asset.source} />}
        <div className="win97-cd-playlist" aria-label="Track list">{TRACKS.map((item, index) => <button type="button" key={item.name} className={index === trackIndex ? 'selected' : ''} onClick={() => { setTrackIndex(index); stop(); }}>{`[${String(index + 1).padStart(2, '0')}] ${item.name}`}<span>{item.length}</span></button>)}</div>
        <div className="win97-cd-mix"><label>Volume <input type="range" min="0" max="1" step=".05" value={volume} onChange={event => { const value = Number(event.target.value); setVolume(value); if (audio.current) audio.current.volume = value; }} /></label><label>Balance <input type="range" min="-1" max="1" step=".1" value={balance} onChange={event => setBalance(Number(event.target.value))} /></label><span>{balance === 0 ? 'C' : balance < 0 ? 'L' : 'R'}</span></div>
        <div className="win97-cd-toggles"><Button95 size="sm" pressed={shuffle} onClick={() => setShuffle(value => !value)}>Rand</Button95><Button95 size="sm" pressed={repeat} onClick={() => setRepeat(value => !value)}>Cont</Button95><Button95 size="sm" pressed={intro} onClick={() => setIntro(value => !value)}>Intro</Button95><small>Total Play: 07:47 m:s · Track: {selectedTrack.length} m:s · CD-ROM (D:) {asset ? 'Ready' : 'No Disc'}</small></div>
      </section>
      <aside className="win97-cd-eq-window" aria-label="Graphic Equalizer"><header>▥ Now Playing - Graphic Equalizer</header><div className="win97-cd-eq-meta">PCM WAV AUDIO <span>16-Bit Stereo · 44,100 Hz</span></div><div className="win97-cd-eq-bars">{bars.map((height, index) => <div key={index}><span style={{ height: eqActive ? `${height}%` : '8%' }} /><small>{['60Hz', '150', '400', '1kHz', '3kHz', '6kHz', '14k'][index]}</small></div>)}</div><div className="win97-cd-eq-sliders"><label>PREAMP<input type="range" min="-12" max="12" defaultValue="0" /></label><label>BASS<input type="range" min="-12" max="12" defaultValue="3" /></label><label>TREBLE<input type="range" min="-12" max="12" defaultValue="4" /></label></div><div className="win97-cd-eq-actions"><Button95 size="sm">Presets</Button95><Button95 size="sm">Reset</Button95><label><input type="checkbox" checked={eqActive} onChange={event => setEqActive(event.target.checked)} /> EQ Active</label></div><footer>DSP Processor: Yamaha OPL3-SAx · DIRECTSOUND</footer></aside>
    </div>
  </div>;
}
