'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getBootWaitingStage97, isBootSkipKey97, shouldFadeBootExit97, type BootStage97 } from './boot-skip';
import {
  BIOS_LINES,
  BIOS_LINE_DELAYS,
  BIOS_MEMORY_STEP,
  BIOS_MEMORY_TARGET,
  BOOT_BIOS_STAGE_MS,
  BOOT_DESKTOP_REVEAL_DELAY_MS,
  BOOT_PROGRESS_INTERVAL_MS,
  BOOT_PROGRESS_SEGMENT_COUNT,
  BOOT_SPLASH_FADE_MS,
  BOOT_STARTING_STAGE_MS,
} from './boot-contract97';

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

export function WeruMark97() {
  return <svg className="boot97-brand-mark" viewBox="0 0 100 90" shapeRendering="crispEdges" aria-hidden="true">
    <path d="M18 9h62v62H18z" fill="#404040" />
    <path d="M15 6h62v62H15z" fill="#c0c0c0" stroke="#fff" strokeWidth="3" />
    <path d="M20 11h52v52H20z" fill="#008000" stroke="#808080" strokeWidth="2" />
    <text x="46" y="51" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="43" fontWeight="900" textAnchor="middle">W</text>
    <path d="M27 72h38v3H27z" fill="#d4d0c8" />
    <path d="M34 77h24v4H34z" fill="#808080" />
  </svg>;
}

export function SegmentedProgress97({ active }: { active: number }) {
  return <div className="boot97-progress-outer" aria-label={`Loading ${Math.round(active / BOOT_PROGRESS_SEGMENT_COUNT * 100)} percent`} role="progressbar" aria-valuemin={0} aria-valuemax={BOOT_PROGRESS_SEGMENT_COUNT} aria-valuenow={active}>
    <div className="boot97-progress-track">
      {Array.from({ length: BOOT_PROGRESS_SEGMENT_COUNT }, (_, index) => <span key={index} className={index < active ? 'active' : ''} />)}
    </div>
  </div>;
}

export default function BootSequence97({ onDone, onRevealDesktop, reducedMotion = false, ready = true }: { onDone: () => void; onRevealDesktop: () => void; reducedMotion?: boolean; ready?: boolean }) {
  const [stage, setStage] = useState<BootStage97>(reducedMotion ? 'done' : 'bios');
  const [lineCount, setLineCount] = useState(reducedMotion ? BIOS_LINES.length : 0);
  const [memoryCount, setMemoryCount] = useState(reducedMotion ? BIOS_MEMORY_TARGET : 0);
  const [memoryTestComplete, setMemoryTestComplete] = useState(reducedMotion);
  const [progress, setProgress] = useState(reducedMotion ? BOOT_PROGRESS_SEGMENT_COUNT : 0);
  const [skipped, setSkipped] = useState(reducedMotion);
  const [fading, setFading] = useState(false);
  const didFinish = useRef(false);
  const finishWhenReady = useRef(false);
  const animateWhenReady = useRef(false);
  const exitTimer = useRef<number | null>(null);
  const preloadPromise = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!reducedMotion) preloadPromise.current = preloadResources();
  }, [reducedMotion]);

  const finish = useCallback((animate = false) => {
    if (didFinish.current) return;
    if (!ready) {
      finishWhenReady.current = true;
      animateWhenReady.current = animate;
      setProgress(BOOT_PROGRESS_SEGMENT_COUNT);
      setSkipped(true);
      setStage(getBootWaitingStage97(stage, animate));
      return;
    }
    didFinish.current = true;
    finishWhenReady.current = false;
    animateWhenReady.current = false;
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
  }, [onDone, onRevealDesktop, ready, reducedMotion, stage]);

  const skip = useCallback(() => finish(shouldFadeBootExit97(stage)), [finish, stage]);

  useEffect(() => {
    if (!reducedMotion || didFinish.current) return;
    const timer = window.setTimeout(() => finish(false), 0);
    return () => window.clearTimeout(timer);
  }, [finish, reducedMotion]);

  useEffect(() => {
    if (!ready || !finishWhenReady.current || didFinish.current) return;
    const timer = window.setTimeout(() => finish(animateWhenReady.current), 0);
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
    const startingTimer = window.setTimeout(() => setStage('starting'), BOOT_BIOS_STAGE_MS);
    const logoTimer = window.setTimeout(() => setStage('logo'), BOOT_BIOS_STAGE_MS + BOOT_STARTING_STAGE_MS);
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
      if (segments < BOOT_PROGRESS_SEGMENT_COUNT) {
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
      if (isBootSkipKey97(event.key)) skip();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [skip, stage]);

  if (stage === 'done') return null;

  // Keep the stage modifier separate from child stage classes. Reusing
  // `.boot97-bios` here let the BIOS panel rule override this fixed overlay.
  return <div className={`boot97 boot97-stage-${stage} ${fading ? 'boot97-fading' : ''}`} onClick={skip} role="presentation">
    <div className="boot97-crt-overlay" aria-hidden="true" />
    <button type="button" className="boot97-skip" onClick={(event) => { event.stopPropagation(); skip(); }}>[ Click anywhere to skip ]</button>

    {stage === 'bios' && <section className="boot97-bios" aria-label="Weru 97 BIOS startup">
      <header className="boot97-bios-header">
        <div>
          <div className="boot97-bios-logo">AWARD MODULAR BIOS v4.51PG, An Energy Star Ally</div>
          <div className="boot97-bios-copyright">Copyright (C) 1984-97, Award Software, Inc.</div>
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
        <div className="boot97-brand-mark-wrap"><WeruMark97 /></div>
        <div className="boot97-brand-title"><span>Weru</span> <b>97</b></div>
        <div className="boot97-brand-subtext">Portfolio Edition</div>
        <SegmentedProgress97 active={progress} />
      </div>
      <footer>Weru 97 · Portfolio Edition</footer>
    </section>}
  </div>;
}
