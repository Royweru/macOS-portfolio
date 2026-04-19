// ─── hooks/useParallax.ts ─────────────────────────────────────────────────────
// Returns spring-smoothed x/y motion values for wallpaper parallax.
// Attach onMouseMove to the root element; pass bgX/bgY as motion.div style.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback } from 'react';
import { useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

interface ParallaxReturn {
  bgX: MotionValue<number>;
  bgY: MotionValue<number>;
  onMouseMove: (e: React.MouseEvent) => void;
}

export function useParallax(strength = 0.008): ParallaxReturn {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
  const maxOffset = isSmallScreen ? 6 : 12;
  const tunedStrength = isSmallScreen ? strength * 0.65 : strength;

  const springX = useSpring(rawX, { stiffness: 40, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 40, damping: 20 });

  const bgX = useTransform(springX, (v) => Math.max(-maxOffset, Math.min(maxOffset, v * tunedStrength)));
  const bgY = useTransform(springY, (v) => Math.max(-maxOffset, Math.min(maxOffset, v * tunedStrength)));

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    rawX.set(e.clientX - window.innerWidth  / 2);
    rawY.set(e.clientY - window.innerHeight / 2);
  }, [rawX, rawY]);

  return { bgX, bgY, onMouseMove };
}
