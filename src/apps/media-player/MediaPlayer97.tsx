'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject, SyntheticEvent } from 'react';
import Button95 from '../../components/win95/Button95';
import type { MediaAsset } from '../../features/media/media-types';
import { adjacentMediaAsset, buildPlayableMediaList, formatMediaDuration, mediaAssetFilename, mediaAssetKey } from '../../features/media/media-playlist';
import { useReducedMotion97 } from '../../hooks/useReducedMotion97';
import { useOsStore } from '../../features/os/os-store';

const STITCH_PREVIEW_TRACKS = [
  { name: 'demo.avi', duration: '00:45', size: '14.3 MB' },
  { name: 'loop97.avi', duration: '00:18', size: '5.8 MB' },
  { name: 'intro3d.mov', duration: '01:12', size: '22.1 MB' },
];

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
    <span className="win97-media-osd win97-media-osd-play">{playing ? 'PLAY ▶' : 'STOP ■'}</span>
    <span className="win97-media-osd win97-media-osd-engine">3D-ENGINE DEMO v1.0</span>
    <small className="win97-media-meta-left">320x240 Cinepak Codec | 15.0 fps</small>
    <small className="win97-media-meta-right">RECORDED 1997-10-14</small>
  </div>;
}

interface MediaPlayer97Props {
  asset?: MediaAsset;
  availableAssets?: MediaAsset[];
}

export default function MediaPlayer97({ asset, availableAssets = [] }: MediaPlayer97Props) {
  const mediaRef = useRef<HTMLMediaElement>(null);
  const library = useMemo(() => buildPlayableMediaList(availableAssets), [availableAssets]);
  const [playlist, setPlaylist] = useState<MediaAsset[]>(() => buildPlayableMediaList([], asset));
  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    const openedAsset = buildPlayableMediaList([], asset)[0];
    return openedAsset ? mediaAssetKey(openedAsset) : null;
  });
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(() => playlist[0]?.durationSeconds ?? 0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [bars, setBars] = useState([18, 42, 26, 58, 34, 48, 22, 48, 35, 24, 42]);
  const [showCodec, setShowCodec] = useState(true);
  const [showCompact, setShowCompact] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [status, setStatus] = useState(() => playlist[0] ? 'Ready' : 'No media loaded');
  const appReducedMotion = useOsStore(state => state.settings.reducedMotion);
  const reducedMotion = useReducedMotion97(appReducedMotion);

  const activeAsset = playlist.find(item => mediaAssetKey(item) === selectedKey);
  const unqueuedAssets = library.filter(item => !playlist.some(queued => mediaAssetKey(queued) === mediaAssetKey(item)));
  const selectedIndex = playlist.findIndex(item => mediaAssetKey(item) === selectedKey);
  const displayName = activeAsset ? mediaAssetFilename(activeAsset) : 'No media loaded';
  const displayDuration = duration || activeAsset?.durationSeconds || 0;

  useEffect(() => {
    if (!mediaRef.current) return;
    mediaRef.current.volume = volume;
    mediaRef.current.muted = muted;
  }, [volume, muted, selectedKey]);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }
    const timer = window.setInterval(() => setBars((currentBars) => currentBars.map(() => playing ? 12 + Math.floor(Math.random() * 55) : 8)), 140);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const stop = () => {
    const media = mediaRef.current;
    if (media) {
      media.pause();
      try { media.currentTime = 0; } catch { /* The resource may not have loaded metadata yet. */ }
    }
    setCurrent(0);
    setPlaying(false);
    setStatus(activeAsset ? 'Stopped' : 'No media loaded');
  };

  const selectAsset = (nextAsset: MediaAsset | null) => {
    const media = mediaRef.current;
    if (media) {
      media.pause();
      try { media.currentTime = 0; } catch { /* The next source will begin at its start. */ }
    }
    setSelectedKey(nextAsset ? mediaAssetKey(nextAsset) : null);
    setCurrent(0);
    setDuration(nextAsset?.durationSeconds ?? 0);
    setPlaying(false);
    setStatus(nextAsset ? `Ready: ${nextAsset.title}` : 'No media loaded');
  };

  const toggle = () => {
    const media = mediaRef.current;
    if (!activeAsset || !media) { setStatus('No media loaded'); return; }
    if (media.paused) {
      void media.play().then(() => {
        setPlaying(true);
        setStatus(`Playing: ${activeAsset.title}`);
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

  const seek = (value: number) => {
    if (!mediaRef.current || !activeAsset || !Number.isFinite(value)) return;
    const maximum = mediaRef.current.duration || activeAsset.durationSeconds || value;
    const nextTime = Math.max(0, Math.min(value, maximum));
    try {
      mediaRef.current.currentTime = nextTime;
      setCurrent(nextTime);
    } catch {
      setStatus('Waiting for media metadata');
    }
  };

  const seekBy = (offset: number) => seek((mediaRef.current?.currentTime ?? current) + offset);
  const changeTrack = (direction: -1 | 1) => {
    const next = adjacentMediaAsset(playlist, selectedKey, direction);
    if (next) selectAsset(next);
    else setStatus(playlist.length ? 'Only one item in playlist' : 'No media loaded');
  };
  const addTrack = (item: MediaAsset) => {
    setPlaylist(currentPlaylist => buildPlayableMediaList([...currentPlaylist, item], item));
    selectAsset(item);
    setShowLibrary(false);
  };
  const removeTrack = () => {
    if (!activeAsset) return;
    const nextPlaylist = playlist.filter(item => mediaAssetKey(item) !== selectedKey);
    const nextAsset = nextPlaylist[Math.min(Math.max(selectedIndex, 0), nextPlaylist.length - 1)] ?? null;
    setPlaylist(nextPlaylist);
    selectAsset(nextAsset);
  };

  const onTimeUpdate = (event: SyntheticEvent<HTMLMediaElement>) => setCurrent(event.currentTarget.currentTime);
  const onMetadata = (event: SyntheticEvent<HTMLMediaElement>) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0);
  const onEnded = () => { setPlaying(false); setStatus('Playback complete'); };
  const onMediaError = () => { setPlaying(false); setStatus('Media unavailable'); };

  return <div className="win97-app win97-media-player win97-media-surface">
    <div className="win95-menubar win97-media-menubar">
      <button type="button" onClick={() => setShowLibrary(true)}><u>F</u>ile</button>
      <button type="button" onClick={() => setShowPlaylist(value => !value)}><u>E</u>dit</button>
      <button type="button" onClick={() => setShowCompact(value => !value)}><u>V</u>iew</button>
      <button type="button" onClick={toggle}><u>P</u>lay</button>
      <button type="button" disabled><u>F</u>avorites</button>
      <button type="button" onClick={() => setShowCodec(true)}><u>H</u>elp</button>
    </div>

    <div className="win97-media-main win97-media-main-stitch">
      <div className="win97-media-primary">
        <div className="win97-media-screen win97-media-screen-stitch">
          {activeAsset?.kind === 'video'
            ? <video ref={mediaRef as RefObject<HTMLVideoElement>} className="win97-media-video" src={activeAsset.source} poster={activeAsset.poster} aria-label={activeAsset.title} preload="metadata" playsInline onTimeUpdate={onTimeUpdate} onLoadedMetadata={onMetadata} onEnded={onEnded} onError={onMediaError}>{activeAsset.captionSource && <track kind="captions" src={activeAsset.captionSource} />}</video>
            : <WireframeViewport playing={playing && !reducedMotion} />}
          {activeAsset?.kind === 'audio' && <audio ref={mediaRef as RefObject<HTMLAudioElement>} src={activeAsset.source} preload="metadata" onTimeUpdate={onTimeUpdate} onLoadedMetadata={onMetadata} onEnded={onEnded} onError={onMediaError} />}
        </div>
        <div className="win97-media-seek-row">
          <input aria-label="Seek" type="range" min="0" max={displayDuration} step="0.1" value={Math.min(current, displayDuration || 0)} disabled={!activeAsset || !displayDuration} onChange={event => seek(Number(event.target.value))} />
          <b>{displayDuration ? `${Math.round(current / displayDuration * 100)}%` : '0%'}</b>
        </div>
      </div>

      {showPlaylist && <aside className="win97-media-playlist win97-media-playlist-stitch" aria-label="Playlist">
        <header><span>Playlist</span><small>({playlist.length || STITCH_PREVIEW_TRACKS.length} items)</small></header>
        <div className="win97-media-playlist-items">
          {playlist.length > 0
            ? playlist.map((item, index) => <button type="button" key={mediaAssetKey(item)} className={mediaAssetKey(item) === selectedKey ? 'selected' : ''} onClick={() => selectAsset(item)}>
              <b>{index + 1}. {mediaAssetFilename(item)}</b><span><small>{formatMediaDuration(item.durationSeconds)}</small><small>{item.kind.toUpperCase()}</small></span>
            </button>)
            : STITCH_PREVIEW_TRACKS.map((item, index) => <button type="button" key={item.name} disabled title="Open an audio or video file to play it.">
              <b>{index + 1}. {item.name}</b><span><small>{item.duration}</small><small>{item.size}</small></span>
            </button>)}
        </div>
        <footer><Button95 size="sm" onClick={() => setShowLibrary(true)}>Add</Button95><Button95 size="sm" disabled={!activeAsset} onClick={removeTrack}>Rem</Button95><Button95 size="sm" pressed={showPlaylist} onClick={() => setShowPlaylist(value => !value)}>List</Button95></footer>
      </aside>}
    </div>

    <div className="win97-media-transport">
      <div className="win97-media-transport-buttons">
        <Button95 size="sm" aria-label="Play" disabled={!activeAsset} pressed={playing} onClick={toggle}>▶</Button95>
        <Button95 size="sm" aria-label="Pause" disabled={!activeAsset} onClick={() => { mediaRef.current?.pause(); setPlaying(false); setStatus('Paused'); }}>❚❚</Button95>
        <Button95 size="sm" aria-label="Stop" disabled={!activeAsset} onClick={stop}>■</Button95>
        <i />
        <Button95 size="sm" aria-label="Previous" disabled={playlist.length < 2} onClick={() => changeTrack(-1)}>|◀</Button95>
        <Button95 size="sm" aria-label="Next" disabled={playlist.length < 2} onClick={() => changeTrack(1)}>▶|</Button95>
        <Button95 size="sm" aria-label="Eject" disabled={!activeAsset} onClick={() => selectAsset(null)}>⏏</Button95>
      </div>
      <output className="win97-media-time-readout">{formatMediaDuration(current)} / {formatMediaDuration(displayDuration)}</output>
      <div className="win97-media-volume"><button type="button" className="win97-media-mute" aria-label={muted ? 'Unmute' : 'Mute'} aria-pressed={muted} onClick={() => setMuted(value => !value)}>{muted ? '🔇' : '🔊'}</button><input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={event => setVolume(Number(event.target.value))} /><Button95 size="sm" onClick={() => setShowCompact(value => !value)}>100%</Button95></div>
    </div>

    <div className="win97-media-status-stitch"><span aria-live="polite"><i />{status}</span><b>{formatMediaDuration(current)}</b><b>{activeAsset?.mimeType ?? 'No media'}</b><b>{activeAsset ? 'Ready' : 'Stereo 22kHz'}</b></div>

    {showCompact && <aside className="win97-media-compact" aria-label="WMP Compact Mode">
      <header><span>▥ WMP COMPACT MODE</span><button type="button" aria-label="Close compact player" onClick={() => setShowCompact(false)}>×</button></header>
      <div className="win97-media-compact-body">
        <div className="win97-media-compact-screen"><span>KBPS: 128</span><span>KHZ: 44.1</span><b>{activeAsset?.kind === 'video' ? 'VIDEO' : 'AUDIO'}</b><strong>*** {displayName.toUpperCase()} ***</strong><div>{bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
        <div className="win97-media-compact-controls"><Button95 size="sm" aria-label="Compact rewind" disabled={!activeAsset} onClick={() => seekBy(-10)}>◀◀</Button95><Button95 size="sm" aria-label="Compact play" disabled={!activeAsset} pressed={playing} onClick={toggle}>▶</Button95><Button95 size="sm" aria-label="Compact pause" disabled={!activeAsset} onClick={() => { mediaRef.current?.pause(); setPlaying(false); setStatus('Paused'); }}>❚❚</Button95><Button95 size="sm" aria-label="Compact stop" disabled={!activeAsset} onClick={stop}>■</Button95><Button95 size="sm" aria-label="Compact fast forward" disabled={!activeAsset} onClick={() => seekBy(10)}>▶▶</Button95></div>
      </div>
    </aside>}

    {showCodec && <div className="win97-media-codec" role="dialog" aria-label="Codec Notice">
      <header><span>● Codec Notice</span><button type="button" aria-label="Close codec notice" onClick={() => setShowCodec(false)}>×</button></header>
      <div className="win97-media-codec-body"><strong>⚠</strong><p>Rendering hardware video acceleration is active. Weru Media Player 6.4 is operating in 16-bit True Color mode.<label><input type="checkbox" /> Don't show this again</label></p></div>
      <footer><Button95 size="sm" onClick={() => setShowCodec(false)}>OK</Button95></footer>
    </div>}

    {showLibrary && <div className="win97-media-library-dialog" role="dialog" aria-modal="true" aria-label="Media Library">
      <header><span>Open Media</span><button type="button" aria-label="Close media library" onClick={() => setShowLibrary(false)}>×</button></header>
      <div className="win97-media-library-list">
        {unqueuedAssets.length > 0
          ? unqueuedAssets.map(item => <button key={mediaAssetKey(item)} type="button" onClick={() => addTrack(item)}><b>{mediaAssetFilename(item)}</b><small>{item.kind.toUpperCase()} · {item.mimeType}</small></button>)
          : <p>No personal media is available. Add files under public/media/videos and register them in PERSONAL_VIDEOS, or open a media file from Explorer.</p>}
      </div>
      <footer><Button95 size="sm" onClick={() => setShowLibrary(false)}>Cancel</Button95></footer>
    </div>}
  </div>;
}
