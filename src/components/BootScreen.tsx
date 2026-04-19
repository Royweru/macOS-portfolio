// ─── components/BootScreen.tsx ────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/boot.css';

interface BootScreenProps {
  onDone: () => void;
}

const STEPS = [15, 35, 55, 72, 88, 100];
const STEP_MS = 280;

const BootScreen: React.FC<BootScreenProps> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setProgress(STEPS[i]);
      i++;
      if (i >= STEPS.length) {
        clearInterval(id);
        setTimeout(onDone, 420);
      }
    }, STEP_MS);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <motion.div
      className="boot-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
    >
      <motion.div
        className="boot-logo"
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        
      </motion.div>

      <div className="boot-progress-track">
        <motion.div
          className="boot-progress-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: STEP_MS / 1000, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

export default BootScreen;
