'use client';

import { useEffect, useRef } from 'react';

interface Star { x: number; y: number; z: number; }

export default function Screensaver97({ onExit, speed = 1 }: { onExit: () => void; speed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; const context = canvas?.getContext('2d'); if (!canvas || !context) return;
    let frame = 0; let animation = 0;
    const stars: Star[] = Array.from({ length: 180 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const draw = () => { const width = canvas.width; const height = canvas.height; context.fillStyle = '#000'; context.fillRect(0, 0, width, height); const cx = width / 2; const cy = height / 2; for (const star of stars) { star.z -= .008 * speed; if (star.z <= .02) { star.x = Math.random() * 2 - 1; star.y = Math.random() * 2 - 1; star.z = 1; } const x = cx + (star.x / star.z) * width / 2; const y = cy + (star.y / star.z) * height / 2; const size = Math.max(1, (1 - star.z) * 4); context.fillStyle = `rgba(255,255,255,${Math.min(1, 1 - star.z)})`; context.fillRect(x, y, size, size); } frame += 1; animation = requestAnimationFrame(draw); };
    resize(); draw(); window.addEventListener('resize', resize); const exit = () => onExit(); window.addEventListener('pointerdown', exit, { once: true }); window.addEventListener('mousemove', exit, { once: true }); window.addEventListener('keydown', exit, { once: true });
    return () => { cancelAnimationFrame(animation); window.removeEventListener('resize', resize); window.removeEventListener('pointerdown', exit); window.removeEventListener('mousemove', exit); window.removeEventListener('keydown', exit); void frame; };
  }, [onExit, speed]);
  return <div className="screensaver97" role="presentation"><canvas ref={canvasRef} /></div>;
}
