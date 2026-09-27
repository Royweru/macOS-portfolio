'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, RefObject, SyntheticEvent } from 'react';
import Button95 from '../../components/win95/Button95';
import type { MediaAsset } from '../../features/media/media-types';
import { adjacentMediaAsset, buildPlayableMediaList, formatMediaDuration, mediaAssetFilename, mediaAssetKey } from '../../features/media/media-playlist';
import { applyCdAudioSettings97, createCdAudioEffectsGraph97, disconnectCdAudioEffects97, type CdAudioEffectsGraph97 } from './audio-effects97';
import { useCdAudioStore97 } from './cd-audio-store97';
import { transitionCdTray97 } from './cd-tray97';
import { calculateCdTime97 } from './cd-time97';
import { toggleCdPlaybackMode97, type CdPlaybackMode97 } from './cd-playback-modes97';
import { nextCdMenuItemIndex97, type CdMenuNavigationKey97 } from './cd-menu-navigation97';

const TRACKS = [
  { name: '01_portfolio-theme.wav', length: '03:42', title: 'Portfolio Theme (Original Mix)' },
  { name: '02_ui-sounds-demo.mid', length: '01:15', title: 'Weru UI Sounds Demo' },
  { name: '03_startup-mix.wav', length: '02:50', title: 'Startup Mix' },
];

interface CdPlayer97Props {
  asset?: MediaAsset;
  availableAssets?: MediaAsset[];
  onOpenApp?: (appId: string) => void;
}

export default function CdPlayer97({ asset, availableAssets = [], onOpenApp }: CdPlayer97Props) {
  const audio = useRef<HTMLAudioElement>(null);
  const playlist = useMemo(() => buildPlayableMediaList(availableAssets, asset).filter(item => item.kind === 'audio'), [availableAssets, asset]);
  const initialTrack = asset?.kind === 'audio' ? asset : playlist[0];
  const playing = useCdAudioStore97(state => state.playing);
  const setPlaying = useCdAudioStore97(state => state.setPlaying);
  const [elapsed, setElapsed] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(() => initialTrack ? mediaAssetKey(initialTrack) : null);
  const [duration, setDuration] = useState(initialTrack?.durationSeconds ?? 0);
  const [status, setStatus] = useState(initialTrack ? 'Ready' : 'No Disc');
  const [trayOpen, setTrayOpen] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [balance, setBalance] = useState(0);
  const [timeMode, setTimeMode] = useState<'elapsed' | 'remain' | 'disc'>('elapsed');
  const [playbackModes, setPlaybackModes] = useState({ shuffle: false, repeat: true, intro: false });
  const [openMenu, setOpenMenu] = useState<'Disc' | 'View' | 'Options' | 'Help' | null>(null);
  const menuRoot = useRef<HTMLDivElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const eqActive = useCdAudioStore97(state => state.eqActive);
  const preampDb = useCdAudioStore97(state => state.preampDb);
  const bassDb = useCdAudioStore97(state => state.bassDb);
  const trebleDb = useCdAudioStore97(state => state.trebleDb);
  const audioContext = useRef<AudioContext | null>(null);
  const effectsGraph = useRef<CdAudioEffectsGraph97 | null>(null);
  const effectsElement = useRef<HTMLAudioElement | null>(null);
  const trackIndex = playlist.findIndex(item => mediaAssetKey(item) === selectedKey);
  const selectedAsset = playlist.find(item => mediaAssetKey(item) === selectedKey);
  const timeReadout = calculateCdTime97({
    mode: timeMode,
    elapsedSeconds: elapsed,
    trackDurationSeconds: duration || selectedAsset?.durationSeconds || 0,
    trackDurationsSeconds: playlist.map(item => item.durationSeconds),
    selectedIndex: trackIndex,
  });
  const totalDuration = timeReadout.totalSeconds;
  const displayedTime = timeReadout.displayedSeconds;
  const introAdvanced = useRef(false);
  const { shuffle, repeat, intro } = playbackModes;
  const togglePlaybackMode = (mode: CdPlaybackMode97) => {
    if (mode === 'intro') introAdvanced.current = false;
    setPlaybackModes(current => toggleCdPlaybackMode97(current, mode));
  };

  useEffect(() => {
    if (!openMenu) return;
    const items = [...(menuRoot.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"], [role="menuitemcheckbox"]') ?? [])].filter(item => !item.disabled);
    items[0]?.focus();
  }, [openMenu]);

  const handleMenuTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, menu: NonNullable<typeof openMenu>) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    setOpenMenu(menu);
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      const trigger = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(':scope > button');
      setOpenMenu(null);
      trigger?.focus();
      return;
    }
    if (!(['ArrowDown', 'ArrowUp', 'Home', 'End'] as string[]).includes(event.key)) return;
    const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"], [role="menuitemcheckbox"]')].filter(item => !item.disabled);
    if (!items.length) return;
    event.preventDefault();
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    const key = event.key as CdMenuNavigationKey97;
    items[nextCdMenuItemIndex97(items.length, currentIndex, key)]?.focus();
  };

  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume, selectedKey]);

  useEffect(() => {
    if (!effectsGraph.current) return;
    applyCdAudioSettings97(effectsGraph.current, { balance, preampDb, bassDb, trebleDb, enabled: eqActive });
  }, [balance, preampDb, bassDb, trebleDb, eqActive]);

  useEffect(() => () => {
    audio.current?.pause();
    setPlaying(false);
    if (effectsGraph.current) disconnectCdAudioEffects97(effectsGraph.current);
    if (audioContext.current && audioContext.current.state !== 'closed') void audioContext.current.close();
  }, [setPlaying]);

  const stop = () => {
    if (audio.current) { audio.current.pause(); try { audio.current.currentTime = 0; } catch { /* Metadata may not be ready. */ } }
    setElapsed(0); setPlaying(false); setStatus(selectedAsset ? 'Stopped' : 'No Disc');
  };

  const eject = () => {
    if (audio.current) audio.current.pause();
    releaseAudioEffects();
    setElapsed(0);
    setDuration(0);
    setSelectedKey(null);
    setPlaying(false);
    const next = transitionCdTray97({ open: trayOpen, status: status === 'Tray Open' ? 'Tray Open' : selectedAsset ? 'Ready' : 'No Disc' }, 'eject');
    setTrayOpen(next.open);
    setStatus(next.status);
  };

  const closeTray = () => {
    const next = transitionCdTray97({ open: trayOpen, status: 'Tray Open' }, 'close');
    setTrayOpen(next.open);
    setStatus(next.status);
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
    setTrayOpen(false);
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

  return <div className="win97-app win97-cd-player" onPointerDownCapture={event => {
    if (!(event.target instanceof Element) || !event.target.closest('.win97-cd-menu-slot')) setOpenMenu(null);
  }} onKeyDown={event => {
    if (event.key === 'Escape' && (openMenu || aboutOpen)) {
      event.preventDefault();
      event.stopPropagation();
      setOpenMenu(null);
      setAboutOpen(false);
    }
  }}>
    <div className="win95-menubar win97-cd-menubar" ref={menuRoot}>
      <div className="win97-cd-menu-slot"><button type="button" aria-haspopup="menu" aria-expanded={openMenu === 'Disc'} onClick={() => setOpenMenu(current => current === 'Disc' ? null : 'Disc')} onKeyDown={event => handleMenuTriggerKeyDown(event, 'Disc')}>Disc</button>{openMenu === 'Disc' && <div className="win97-cd-menu-popup" role="menu" aria-label="Disc menu" onKeyDown={handleMenuKeyDown}><button type="button" role="menuitem" disabled={trayOpen} onClick={() => { eject(); setOpenMenu(null); }}>Eject CD Tray</button><button type="button" role="menuitem" disabled={!trayOpen} onClick={() => { closeTray(); setOpenMenu(null); }}>Close Tray</button></div>}</div>
      <div className="win97-cd-menu-slot"><button type="button" aria-haspopup="menu" aria-expanded={openMenu === 'View'} onClick={() => setOpenMenu(current => current === 'View' ? null : 'View')} onKeyDown={event => handleMenuTriggerKeyDown(event, 'View')}>View</button>{openMenu === 'View' && <div className="win97-cd-menu-popup" role="menu" aria-label="View menu" onKeyDown={handleMenuKeyDown}><button type="button" role="menuitem" disabled={!onOpenApp} onClick={() => { onOpenApp?.('cd-equalizer'); setOpenMenu(null); }}>Graphic Equalizer…</button></div>}</div>
      <div className="win97-cd-menu-slot"><button type="button" aria-haspopup="menu" aria-expanded={openMenu === 'Options'} onClick={() => setOpenMenu(current => current === 'Options' ? null : 'Options')} onKeyDown={event => handleMenuTriggerKeyDown(event, 'Options')}>Options</button>{openMenu === 'Options' && <div className="win97-cd-menu-popup" role="menu" aria-label="Options menu" onKeyDown={handleMenuKeyDown}><button type="button" role="menuitemcheckbox" aria-checked={shuffle} onClick={() => togglePlaybackMode('shuffle')}><span>{shuffle ? '✓ ' : ''}Random Shuffle</span></button><button type="button" role="menuitemcheckbox" aria-checked={repeat} onClick={() => togglePlaybackMode('repeat')}><span>{repeat ? '✓ ' : ''}Continuous Repeat</span></button><button type="button" role="menuitemcheckbox" aria-checked={intro} onClick={() => togglePlaybackMode('intro')}><span>{intro ? '✓ ' : ''}Intro Scan (10 seconds)</span></button></div>}</div>
      <div className="win97-cd-menu-slot"><button type="button" aria-haspopup="menu" aria-expanded={openMenu === 'Help'} onClick={() => setOpenMenu(current => current === 'Help' ? null : 'Help')} onKeyDown={event => handleMenuTriggerKeyDown(event, 'Help')}>Help</button>{openMenu === 'Help' && <div className="win97-cd-menu-popup" role="menu" aria-label="Help menu" onKeyDown={handleMenuKeyDown}><button type="button" role="menuitem" onClick={() => { setAboutOpen(true); setOpenMenu(null); }}>About CD Player</button></div>}</div>
    </div>
    <div className="win97-cd-layout win97-cd-layout-single">
      <section className="win97-cd-deck" aria-label="CD Player">
        <div className="win97-cd-lcd"><span>● {playing ? 'PLAYING DISC (D:)' : selectedAsset ? `${status.toUpperCase()} (D:)` : 'NO DISC (D:)'}</span><strong>[{String(Math.max(0, trackIndex + 1)).padStart(2, '0')}] {formatMediaDuration(displayedTime)}</strong><small>MODE: {timeMode === 'elapsed' ? 'TRACK TIME' : timeMode === 'remain' ? 'TRACK REMAIN' : 'DISC REMAIN'} <b>STEREO 44.1K</b></small></div>
        <div className="win97-cd-modes">
          <label><input type="radio" checked={timeMode === 'elapsed'} onChange={() => setTimeMode('elapsed')} /> Track Elapsed</label>
          <label><input type="radio" checked={timeMode === 'remain'} onChange={() => setTimeMode('remain')} /> Track Remain</label>
          <label><input type="radio" checked={timeMode === 'disc'} onChange={() => setTimeMode('disc')} /> Disc Remain</label>
        </div>
        <div className="win97-toolbar win97-cd-controls"><Button95 size="sm" aria-label="Previous track" disabled={playlist.length < 2 || trayOpen} onClick={() => cycleTrack(-1)}>|◀</Button95><Button95 size="sm" aria-label="Fast reverse" disabled={!selectedAsset} onClick={() => seekBy(-10)}>◀◀</Button95><Button95 size="sm" aria-label="Play" disabled={!selectedAsset} pressed={playing} onClick={toggle}>▶</Button95><Button95 size="sm" aria-label="Pause" disabled={!selectedAsset} onClick={() => { audio.current?.pause(); setPlaying(false); setStatus('Paused'); }}>❚❚</Button95><Button95 size="sm" aria-label="Stop" disabled={!selectedAsset} onClick={stop}>■</Button95><Button95 size="sm" aria-label="Fast forward" disabled={!selectedAsset} onClick={() => seekBy(10)}>▶▶</Button95><Button95 size="sm" aria-label="Next track" disabled={playlist.length < 2 || trayOpen} onClick={() => cycleTrack(1)}>▶|</Button95><Button95 size="sm" aria-label="Eject" disabled={trayOpen} onClick={eject}>⏏</Button95></div>
        {trayOpen && <div className="win97-cd-tray-notice" role="status"><strong>CD-ROM TRAY OPEN: DRIVE D:\ READY FOR INSERTION</strong><Button95 size="sm" onClick={closeTray}>Close Tray</Button95></div>}
        <div className="win97-cd-fields"><label>Artist <select defaultValue="Music Library <C:\Music>"><option>Music Library &lt;C:\Music&gt;</option></select></label><label>Title <select value={selectedKey ?? ''} onChange={event => selectTrack(playlist.find(item => mediaAssetKey(item) === event.target.value) ?? null)} disabled={!playlist.length}><option value="">No Disc</option>{playlist.map(item => <option key={mediaAssetKey(item)} value={mediaAssetKey(item)}>{item.title}</option>)}</select></label><label>Track <select value={selectedKey ?? ''} onChange={event => selectTrack(playlist.find(item => mediaAssetKey(item) === event.target.value) ?? null)} disabled={!playlist.length}><option value="">No Disc</option>{playlist.map((item, index) => <option key={mediaAssetKey(item)} value={mediaAssetKey(item)}>{`[${index + 1}] ${mediaAssetFilename(item)} (${formatMediaDuration(item.durationSeconds)})`}</option>)}</select></label></div>
        {!selectedAsset && <div className="sunken win97-empty-media">No playable tracks loaded. Add audio to C:\Music or open a track from Explorer.</div>}
        {selectedAsset && <audio key={selectedKey ?? undefined} ref={audio as RefObject<HTMLAudioElement>} preload="metadata" src={selectedAsset.source} loop={repeat && !shuffle} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onMetadata} onEnded={onEnded} onError={() => { setPlaying(false); setStatus('Media unavailable'); }} />}
        <div className="win97-cd-playlist" aria-label="Track list">{playlist.length > 0 ? playlist.map((item, index) => <button type="button" key={mediaAssetKey(item)} className={mediaAssetKey(item) === selectedKey ? 'selected' : ''} onClick={() => selectTrack(item)}>{`[${String(index + 1).padStart(2, '0')}] ${mediaAssetFilename(item)}`}<span>{formatMediaDuration(item.durationSeconds)}</span></button>) : TRACKS.map((item, index) => <button type="button" key={item.name} disabled title="Reference-layout sample only. Add a real track to C:\Music to enable playback.">{`[${String(index + 1).padStart(2, '0')}] ${item.name}`}<span>{item.length}</span></button>)}</div>
        <div className="win97-cd-mix"><label>Volume <input aria-label="CD volume" type="range" min="0" max="1" step=".05" value={volume} onChange={event => setVolume(Number(event.target.value))} /></label><label>Balance <input aria-label="CD balance" type="range" min="-1" max="1" step=".1" value={balance} onChange={event => setBalance(Number(event.target.value))} /></label><span>{balance === 0 ? 'C' : balance < 0 ? 'L' : 'R'}</span></div>
        <div className="win97-cd-toggles"><Button95 size="sm" pressed={shuffle} onClick={() => togglePlaybackMode('shuffle')}>Rand</Button95><Button95 size="sm" pressed={repeat} onClick={() => togglePlaybackMode('repeat')}>Cont</Button95><Button95 size="sm" pressed={intro} onClick={() => togglePlaybackMode('intro')}>Intro</Button95></div>
      </section>
    </div>
    <div className="win97-cd-status" aria-label="CD Player status">
      <span>Total Play: {formatMediaDuration(totalDuration)} m:s</span>
      <span>Track: {formatMediaDuration(duration)} m:s</span>
      <span><i data-ready={Boolean(selectedAsset && !trayOpen)} />CD-ROM (D:) {trayOpen ? 'Tray Open' : selectedAsset ? 'Ready' : 'No Disc'}</span>
    </div>
    {aboutOpen && <div className="win97-cd-about-layer"><section className="win97-cd-about" role="dialog" aria-modal="true" aria-label="About CD Player"><header><span>About CD Player</span><button type="button" aria-label="Close About CD Player" onClick={() => setAboutOpen(false)}>×</button></header><p><b>Weru CD Player</b><br />Digital Audio · Version 4.0</p><small>Playback controls operate on audio files selected from C:\Music or opened through File Explorer.</small><footer><Button95 size="sm" onClick={() => setAboutOpen(false)}>OK</Button95></footer></section></div>}
  </div>;
}
