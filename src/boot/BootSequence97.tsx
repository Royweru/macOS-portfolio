'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isBootSkipKey97 } from './boot-skip';

export type BootStage97 = 'bios' | 'starting' | 'logo' | 'done';

const BIOS_LINES = [
  'PENTIUM-MMX CPU at 233MHz',
  'Memory Test',
  'Award Plug and Play BIOS Extension v1.0A',
  'Initialize Plug and Play Cards...',
  'PNP Init Completed',
  'Detecting Primary Master ... QUANTUM FIREBALL ST3.2A',
  'Detecting Primary Slave  ... ATAPI CD-ROM 24X MAX',
  'Detecting Secondary Master ... None',
  'Verifying DMI Pool Data .....................',
  'Booting from C:\\ drive...',
];

const BIOS_LINE_DELAYS = [100, 230, 930, 1060, 1190, 1320, 1450, 1580, 1710, 1840];
const BIOS_MEMORY_TARGET = 65536;
const BIOS_MEMORY_STEP = 8192;
const BOOT_PROGRESS_INTERVAL_MS = 120;
const BOOT_DESKTOP_REVEAL_DELAY_MS = 350;
const BOOT_SPLASH_FADE_MS = 700;

const PRELOAD_ASSETS = [
  '/assets/win97/wallpaper/bliss.svg',
  '/assets/win97/icons/computer.svg',
  '/assets/win97/icons/folder.svg',
  '/assets/win97/icons/ie4.svg',
];

function preloadResources() {
  if (typeof document === 'undefined') return Promise.resolve();
  return Promise.all(PRELOAD_ASSETS.map((src) => new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  }))).then(() => undefined);
}

function WeruFlag() {
  return <svg className="boot97-flag" viewBox="0 0 100 90" aria-hidden="true">
    <path d="M12 18 Q26 12 44 20 Q46 38 43 56 Q24 48 10 56 Z" fill="#d32f2f" />
    <path d="M48 21 Q66 29 86 20 Q88 38 84 56 Q66 64 47 57 Z" fill="#1976d2" />
    <path d="M9 60 Q24 53 43 60 Q41 78 40 85 Q22 78 8 85 Z" fill="#388e3c" />
    <path d="M46 61 Q66 68 83 60 Q82 78 80 85 Q64 91 44 85 Z" fill="#fbc02d" />
    <path d="M13 19 Q26 14 43 21 M49 22 Q66 30 85 21" stroke="#fff" strokeWidth="1.5" opacity=".6" />
    <rect x="88" y="24" width="3" height="3" fill="#1976d2" opacity=".7" />
    <rect x="94" y="27" width="2" height="2" fill="#1976d2" opacity=".5" />
    <rect x="85" y="64" width="3" height="3" fill="#fbc02d" opacity=".7" />
    <rect x="91" y="66" width="2" height="2" fill="#fbc02d" opacity=".5" />
  </svg>;
}

function SegmentedProgress({ active }: { active: number }) {
  return <div className="boot97-progress-outer" aria-label={`Loading ${Math.round(active / 18 * 100)} percent`} role="progressbar" aria-valuemin={0} aria-valuemax={18} aria-valuenow={active}>
    <div className="boot97-progress-track">
      {Array.from({ length: 18 }, (_, index) => <span key={index} className={index < active ? 'active' : ''} />)}
    </div>
  </div>;
}

export default function BootSequence97({ onDone, onRevealDesktop, reducedMotion = false, ready = true }: { onDone: () => void; onRevealDesktop: () => void; reducedMotion?: boolean; ready?: boolean }) {
  const [stage, setStage] = useState<BootStage97>(reducedMotion ? 'done' : 'bios');
  const [lineCount, setLineCount] = useState(reducedMotion ? BIOS_LINES.length : 0);
  const [memoryCount, setMemoryCount] = useState(reducedMotion ? BIOS_MEMORY_TARGET : 0);
  const [memoryTestComplete, setMemoryTestComplete] = useState(reducedMotion);
  const [progress, setProgress] = useState(reducedMotion ? 18 : 0);
  const [skipped, setSkipped] = useState(reducedMotion);
  const [fading, setFading] = useState(false);
  const didFinish = useRef(false);
  const finishWhenReady = useRef(false);
  const exitTimer = useRef<number | null>(null);
  const preloadPromise = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!reducedMotion) preloadPromise.current = preloadResources();
  }, [reducedMotion]);

  const finish = useCallback((animate = false) => {
    if (didFinish.current) return;
    if (!ready) {
      finishWhenReady.current = true;
      setProgress(18);
      setSkipped(true);
      setStage('starting');
      return;
    }
    didFinish.current = true;
    finishWhenReady.current = false;
    setSkipped(true);
    onRevealDesktop();
    if (animate && !reducedMotion) {
      setFading(true);
      exitTimer.current = window.setTimeout(() => {
        setStage('done');
        onDone();
      }, BOOT_SPLASH_FADE_MS);
      return;
    }
    setStage('done');
    onDone();
  }, [onDone, onRevealDesktop, ready, reducedMotion]);

  useEffect(() => {
    if (!reducedMotion || didFinish.current) return;
    const timer = window.setTimeout(() => finish(false), 0);
    return () => window.clearTimeout(timer);
  }, [finish, reducedMotion]);

  useEffect(() => {
    if (!ready || !finishWhenReady.current || didFinish.current) return;
    const timer = window.setTimeout(() => finish(false), 0);
    return () => window.clearTimeout(timer);
  }, [finish, ready]);

  useEffect(() => () => {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
  }, []);

  useEffect(() => {
    if (skipped || reducedMotion) return;
    let memoryTimer: number | null = null;
    const revealTimers = BIOS_LINE_DELAYS.map((delay, index) => window.setTimeout(() => {
      setLineCount(index + 1);
      if (index !== 1) return;

      let currentMemory = 0;
      memoryTimer = window.setInterval(() => {
        currentMemory = Math.min(BIOS_MEMORY_TARGET, currentMemory + BIOS_MEMORY_STEP);
        setMemoryCount(currentMemory);
        if (currentMemory === BIOS_MEMORY_TARGET && memoryTimer !== null) {
          window.clearInterval(memoryTimer);
          memoryTimer = null;
          setMemoryTestComplete(true);
        }
      }, 60);
    }, delay));
    const startingTimer = window.setTimeout(() => setStage('starting'), 2100);
    const logoTimer = window.setTimeout(() => setStage('logo'), 3000);
    return () => {
      revealTimers.forEach(window.clearTimeout);
      if (memoryTimer !== null) window.clearInterval(memoryTimer);
      window.clearTimeout(startingTimer);
      window.clearTimeout(logoTimer);
    };
  }, [reducedMotion, skipped]);

  useEffect(() => {
    if (stage !== 'logo' || skipped) return;
    let active = true;
    let segments = 0;
    let revealTimer: number | null = null;
    const timer = window.setInterval(() => {
      if (!active) return;
      if (segments < 18) {
        segments += 1;
        setProgress(segments);
        return;
      }

      window.clearInterval(timer);
      revealTimer = window.setTimeout(() => {
        void (preloadPromise.current ?? Promise.resolve()).then(() => {
          if (active) finish(true);
        });
      }, BOOT_DESKTOP_REVEAL_DELAY_MS);
    }, BOOT_PROGRESS_INTERVAL_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
      if (revealTimer !== null) window.clearTimeout(revealTimer);
    };
  }, [finish, skipped, stage]);

  useEffect(() => {
    if (stage === 'done') return;
    const handleKey = (event: KeyboardEvent) => {
      if (isBootSkipKey97(event.key)) finish();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [finish, stage]);

  if (stage === 'done') return null;

  // Keep the stage modifier separate from child stage classes. Reusing
  // `.boot97-bios` here let the BIOS panel rule override this fixed overlay.
  return <div className={`boot97 boot97-stage-${stage} ${fading ? 'boot97-fading' : ''}`} onClick={() => finish()} role="presentation">
    <div className="boot97-crt-overlay" aria-hidden="true" />
    <button type="button" className="boot97-skip" onClick={(event) => { event.stopPropagation(); finish(); }}>[ Click anywhere to skip ]</button>

    {stage === 'bios' && <section className="boot97-bios" aria-label="Weru 97 BIOS startup">
      <header className="boot97-bios-header">
        <div>
          <strong>AWARD MODULAR BIOS v4.51PG, An Energy Star Ally</strong>
          <span>Copyright (C) 1984-97, Award Software, Inc.</span>
        </div>
        <div className="boot97-energy-star">EPA POLLUTION PREVENTER<br /><b>ENERGY STAR</b></div>
      </header>
      <p className="boot97-bios-board">P5I430TX/250 TITAN-TURBO TITANIUM SERIES</p>
      <div className="boot97-bios-lines">
        {BIOS_LINES.slice(0, lineCount).map((line, index) => <div key={line} className={`boot97-bios-line boot97-bios-line-${index + 1} ${index === BIOS_LINES.length - 1 ? 'boot97-bios-boot-line' : ''}`}>
          {index === 1 ? <>Memory Test : <span className="boot97-memory-count">{memoryCount}K</span> <span className="boot97-memory-ok" data-complete={memoryTestComplete}>OK</span></> : line}
          {index === 8 && <span className="boot97-dmi-success"> Update Successful</span>}
          {index === BIOS_LINES.length - 1 && <i aria-hidden="true" />}
        </div>)}
      </div>
    </section>}

    {stage === 'starting' && <section className="boot97-starting" aria-label="Starting Weru 97">Starting Weru 97...</section>}

    {stage === 'logo' && <section className="boot97-splash" aria-label="Weru 97 splash screen">
      <div className="boot97-splash-cloud boot97-splash-cloud-one" />
      <div className="boot97-splash-cloud boot97-splash-cloud-two" />
      <div className="boot97-splash-content">
        <WeruFlag />
        <div className="boot97-brand-title"><span>Weru</span> <b>97</b></div>
        <div className="boot97-brand-subtext">Portfolio Edition</div>
        <SegmentedProgress active={progress} />
      </div>
      <footer>Weru 97 · Portfolio Edition</footer>
    </section>}
  </div>;
}
