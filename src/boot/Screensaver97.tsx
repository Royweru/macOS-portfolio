'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion97 } from '../hooks/useReducedMotion97';
import { advanceStarfield97, attachScreensaverExit97, type ScreensaverStar97 } from './screensaver-motion97';

export default function Screensaver97({ onExit, speed = 1, reducedMotion: forcedReducedMotion = false }: { onExit: () => void; speed?: number; reducedMotion?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion97(forcedReducedMotion);
  useEffect(() => {
    const canvas = canvasRef.current; const context = canvas?.getContext('2d'); if (!canvas || !context) return;
    let animation = 0;
    const stars: ScreensaverStar97[] = Array.from({ length: 180 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const draw = () => { const width = canvas.width; const height = canvas.height; context.fillStyle = '#000'; context.fillRect(0, 0, width, height); const cx = width / 2; const cy = height / 2; advanceStarfield97(stars, { reducedMotion, speed }); for (const star of stars) { const x = cx + (star.x / star.z) * width / 2; const y = cy + (star.y / star.z) * height / 2; const size = Math.max(1, (1 - star.z) * 4); context.fillStyle = `rgba(255,255,255,${Math.min(1, 1 - star.z)})`; context.fillRect(x, y, size, size); } if (!reducedMotion) animation = requestAnimationFrame(draw); };
    resize(); draw(); window.addEventListener('resize', resize); const removeExitListeners = attachScreensaverExit97(window, onExit);
    return () => { cancelAnimationFrame(animation); window.removeEventListener('resize', resize); removeExitListeners(); };
  }, [onExit, reducedMotion, speed]);
  return <div className="screensaver97" role="presentation"><canvas ref={canvasRef} /></div>;
}
