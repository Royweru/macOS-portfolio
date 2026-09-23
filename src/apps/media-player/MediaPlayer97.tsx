'use client';

import { useEffect, useRef, useState } from 'react';
import Button95 from '../../components/win95/Button95';
import type { MediaAsset } from '../../features/media/media-types';
import { useReducedMotion97 } from '../../hooks/useReducedMotion97';
import { useOsStore } from '../../features/os/os-store';

const PLAYLIST = [
  { name: 'demo.avi', duration: '00:45', size: '14.3 MB' },
  { name: 'loop97.avi', duration: '00:18', size: '5.8 MB' },
  { name: 'intro3d.mov', duration: '01:12', size: '22.1 MB' },
];

const formatTime = (value: number) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

function WireframeViewport({ playing }: { playing: boolean }) {
  return <div className="win97-media-demo" aria-label="3D engine demo preview">
    <svg className={playing ? 'win97-media-wireframe spinning' : 'win97-media-wireframe'} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <ellipse cx="50" cy="50" rx="42" ry="18" />
      <ellipse cx="50" cy="50" rx="35" ry="35" strokeDasharray="2,2" />
      <ellipse cx="50" cy="50" rx="18" ry="42" />
      <polygon points="50,10 85,75 15,75" stroke="#7BB3E8" strokeWidth=".5" />
      <polygon points="50,90 15,25 85,25" stroke="#F8D878" strokeWidth=".5" />
      <line stroke="#7BB3E8" x1="10" x2="90" y1="50" y2="50" />
      <line stroke="#7BB3E8" x1="50" x2="50" y1="10" y2="90" />
    </svg>
    <span className="win97-media-osd win97-media-osd-play">{playing ? 'PLAY ▶' : 'STOP ■'} [00:{playing ? '24.12' : '00.00'}]</span>
    <span className="win97-media-osd win97-media-osd-engine">3D-ENGINE DEMO v1.0</span>
    <small className="win97-media-meta-left">320x240 Cinepak Codec | 15.0 fps</small>
    <small className="win97-media-meta-right">RECORDED 1997-10-14</small>
  </div>;
}

export default function MediaPlayer97({ asset }: { asset?: MediaAsset }) {
  const mediaRef = useRef<HTMLMediaElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState(asset?.title ?? PLAYLIST[0].name);
  const [bars, setBars] = useState([18, 42, 26, 58, 34, 48, 22, 48, 35, 24, 42]);
  const [showCodec, setShowCodec] = useState(true);
  const [showCompact, setShowCompact] = useState(true);
  const [status, setStatus] = useState('Ready');
  const appReducedMotion = useOsStore(state => state.settings.reducedMotion);
  const reducedMotion = useReducedMotion97(appReducedMotion);
  const isVideo = asset?.kind === 'video';
  const track = PLAYLIST.find((item) => item.name === selectedTrack) ?? PLAYLIST[0];

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    const time = () => setCurrent(media.currentTime);
    const metadata = () => setDuration(media.duration || 0);
    const ended = () => { setPlaying(false); setStatus('Playback complete'); };
    const failed = () => { setPlaying(false); setStatus('Media unavailable'); };
    media.addEventListener('timeupdate', time);
    media.addEventListener('loadedmetadata', metadata);
    media.addEventListener('ended', ended);
    media.addEventListener('error', failed);
    return () => {
      media.removeEventListener('timeupdate', time);
      media.removeEventListener('loadedmetadata', metadata);
      media.removeEventListener('ended', ended);
      media.removeEventListener('error', failed);
    };
  }, [asset]);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }
    const timer = window.setInterval(() => setBars((currentBars) => currentBars.map(() => playing ? 12 + Math.floor(Math.random() * 55) : 8)), 140);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const toggle = () => {
    const media = mediaRef.current;
    if (!media) { setStatus('No media loaded'); return; }
    if (media.paused) {
      void media.play().then(() => {
        setPlaying(true);
        setStatus(`Playing: ${asset?.title ?? selectedTrack}`);
      }).catch(() => {
        setPlaying(false);
        setStatus('Media unavailable');
      });
    } else {
      media.pause();
      setPlaying(false);
      setStatus('Paused');
    }
  };

  const stop = () => {
    if (mediaRef.current) { mediaRef.current.pause(); mediaRef.current.currentTime = 0; }
    setCurrent(0);
    setPlaying(false);
    setStatus('Stopped');
  };

  const seek = (value: number) => {
    if (!mediaRef.current) return;
    mediaRef.current.currentTime = value;
    setCurrent(value);
  };

  return <div className="win97-app win97-media-player win97-media-surface">
    <div className="win95-menubar win97-media-menubar">
      <button type="button" onClick={() => setShowCodec(true)}><u>F</u>ile</button>
      <button type="button"><u>E</u>dit</button>
      <button type="button"><u>V</u>iew</button>
      <button type="button" onClick={toggle}><u>P</u>lay</button>
      <button type="button"><u>F</u>avorites</button>
      <button type="button"><u>H</u>elp</button>
    </div>

    <div className="win97-media-main win97-media-main-stitch">
      <div className="win97-media-primary">
        <div className="win97-media-screen win97-media-screen-stitch">
          {asset && isVideo ? <video ref={mediaRef as React.RefObject<HTMLVideoElement>} className="win97-media-video" src={asset.source} poster={asset.poster} aria-label={asset.title}>{asset.captionSource && <track kind="captions" src={asset.captionSource} />}</video> : <WireframeViewport playing={playing && !reducedMotion} />}
          {asset && !isVideo && <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={asset.source} preload="metadata" />}
        </div>
        <div className="win97-media-seek-row">
          <input aria-label="Seek" type="range" min="0" max={duration || 45} step="0.1" value={current} onChange={(event) => seek(Number(event.target.value))} />
          <b>{duration ? `${Math.round(current / duration * 100)}%` : '53%'}</b>
        </div>
      </div>

      <aside className="win97-media-playlist win97-media-playlist-stitch" aria-label="Playlist">
        <header><span>Playlist</span><small>(3 items)</small></header>
        <div className="win97-media-playlist-items">
          {PLAYLIST.map((item, index) => <button type="button" key={item.name} className={selectedTrack === item.name ? 'selected' : ''} onClick={() => { setSelectedTrack(item.name); setStatus(`Selected: ${item.name}`); }}>
            <b>{index + 1}. {item.name}</b><span><small>{item.duration}</small><small>{item.size}</small></span>
          </button>)}
        </div>
        <footer><Button95 size="sm">Add</Button95><Button95 size="sm">Rem</Button95><Button95 size="sm">List</Button95></footer>
      </aside>
    </div>

    <div className="win97-media-transport">
      <div className="win97-media-transport-buttons">
        <Button95 size="sm" aria-label="Play" pressed={playing} onClick={toggle}>▶</Button95>
        <Button95 size="sm" aria-label="Pause" onClick={() => { mediaRef.current?.pause(); setPlaying(false); setStatus('Paused'); }}>❚❚</Button95>
        <Button95 size="sm" aria-label="Stop" onClick={stop}>■</Button95>
        <i />
        <Button95 size="sm" aria-label="Previous">|◀</Button95>
        <Button95 size="sm" aria-label="Next">▶|</Button95>
        <Button95 size="sm" aria-label="Eject">⏏</Button95>
      </div>
      <output className="win97-media-time-readout">{formatTime(current)} / {formatTime(duration || 45)}</output>
      <div className="win97-media-volume"><span>🔊</span><input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); if (mediaRef.current) mediaRef.current.volume = value; }} /><Button95 size="sm" onClick={() => setShowCompact((value) => !value)}>100%</Button95></div>
    </div>

    <div className="win97-media-status-stitch"><span aria-live="polite"><i />{status}</span><b>{formatTime(current)}</b><b>{track.size}</b><b>Stereo 22kHz</b></div>

    {showCompact && <aside className="win97-media-compact" aria-label="WMP Compact Mode">
      <header><span>▥ WMP COMPACT MODE</span><button type="button" aria-label="Close compact player" onClick={() => setShowCompact(false)}>×</button></header>
      <div className="win97-media-compact-body">
        <div className="win97-media-compact-screen"><span>KBPS: 128</span><span>KHZ: 44.1</span><b>MONO</b><strong>*** {selectedTrack.toUpperCase()} [320x240 - CINEPAK 1997 RELEASE] ***</strong><div>{bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
        <div className="win97-media-compact-controls"><Button95 size="sm" aria-label="Compact rewind">◀◀</Button95><Button95 size="sm" aria-label="Compact play" pressed={playing} onClick={toggle}>▶</Button95><Button95 size="sm" aria-label="Compact pause">❚❚</Button95><Button95 size="sm" aria-label="Compact stop" onClick={stop}>■</Button95><Button95 size="sm" aria-label="Compact fast forward">▶▶</Button95></div>
      </div>
    </aside>}

    {showCodec && <div className="win97-media-codec" role="dialog" aria-label="Codec Notice">
      <header><span>● Codec Notice</span><button type="button" aria-label="Close codec notice" onClick={() => setShowCodec(false)}>×</button></header>
      <div className="win97-media-codec-body"><strong>⚠</strong><p>Rendering hardware video acceleration is active. Weru Media Player 6.4 is operating in 16-bit True Color mode.<label><input type="checkbox" /> Don't show this again</label></p></div>
      <footer><Button95 size="sm" onClick={() => setShowCodec(false)}>OK</Button95></footer>
    </div>}
  </div>;
}
