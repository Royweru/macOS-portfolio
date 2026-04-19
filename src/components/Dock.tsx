/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Briefcase, Code2, Mail, FolderOpen, User, Trash2 } from 'lucide-react';

interface DockProps {
  openWindows: string[];
  onOpen: (id: string) => void;
}

const iconBase = "flex items-center justify-center rounded-[13px] text-white shadow-lg relative overflow-hidden";

const DOCK_ITEMS = [
  { id: 'about',      label: 'About Me',   color: 'linear-gradient(145deg,#667eea,#764ba2)', icon: <User size={22}/> },
  { id: 'projects',   label: 'Projects',   color: 'linear-gradient(145deg,#2196F3,#1565C0)', icon: <FolderOpen size={22}/> },
  { id: 'experience', label: 'Experience', color: 'linear-gradient(145deg,#FF9800,#E65100)', icon: <Briefcase size={22}/> },
  { id: 'skills',     label: 'Skills',     color: 'linear-gradient(145deg,#4CAF50,#2E7D32)', icon: <Code2 size={22}/> },
  { id: 'contact',    label: 'Contact',    color: 'linear-gradient(145deg,#26C6DA,#00838F)', icon: <Mail size={22}/> },
  { id: 'div1', label: '', color: '', icon: null, isDivider: true },
  {
    id: 'github', label: 'GitHub', color: '#1a1a1a',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>,
    external: 'https://github.com/weru',
  },
  {
    id: 'linkedin', label: 'LinkedIn', color: '#0A66C2',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    external: 'https://linkedin.com/in/weru',
  },
  { id: 'div2', label: '', color: '', icon: null, isDivider: true },
  { id: 'trash', label: 'Trash', color: 'linear-gradient(145deg,#90a0b0,#607080)', icon: <Trash2 size={20}/> },
];

function DockIcon({ item, openWindows, onOpen }:{item:any,openWindows:any,onOpen:any}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const distance = useMotionValue(1000);

  const size = useSpring(
    useTransform(distance, [-120, 0, 120], [44, 68, 44]),
    { stiffness: 350, damping: 22 }
  );
  const y = useSpring(
    useTransform(distance, [-120, 0, 120], [0, -14, 0]),
    { stiffness: 350, damping: 22 }
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    distance.set(e.clientX - center);
  };

  const handleClick = () => {
    if (item.isDivider || item.id === 'trash') return;
    if (item.external) { window.open(item.external, '_blank'); return; }
    setBouncing(true);
    setTimeout(() => setBouncing(false), 700);
    onOpen(item.id);
  };

  if (item.isDivider) {
    return <div className="w-px self-stretch bg-white/30 mx-1" style={{ marginBottom: 8 }} />;
  }

  const isOpen = openWindows.includes(item.id);

  return (
    <div className="relative flex flex-col items-center" ref={ref}>
      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-full mb-2.5 px-2.5 py-1 rounded-lg text-white text-[12px] font-medium whitespace-nowrap pointer-events-none z-50 shadow-lg"
            style={{ background: 'rgba(30,30,35,0.88)', backdropFilter: 'blur(8px)' }}
          >
            {item.label}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(30,30,35,0.88)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon wrapper */}
      <motion.div
        style={{ width: size, height: size, y }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => { setTooltip(false); distance.set(1000); }}
        onClick={handleClick}
        animate={bouncing ? { y: [-14, 0, -10, 0, -6, 0] } : {}}
        transition={bouncing ? { duration: 0.6, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } : {}}
        className="cursor-pointer"
      >
        <div
          className={iconBase}
          style={{
            background: item.color,
            width: '100%',
            height: '100%',
            borderRadius: '22%',
            boxShadow: isOpen
              ? '0 6px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.15)'
              : '0 4px 14px rgba(0,0,0,0.2)',
          }}
        >
          {item.icon}
          {/* Gloss overlay */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-[22%] pointer-events-none"
            style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.22) 0%,transparent 100%)' }}
          />
        </div>
      </motion.div>

      {/* Open dot */}
      <motion.div
        className="mt-1 w-1 h-1 rounded-full bg-gray-600"
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}

const Dock: React.FC<DockProps> = ({ openWindows, onOpen }) => {
  const mouseX = useMotionValue(Infinity);


  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="dock rounded-[22px] px-3 pt-2 pb-1 flex items-end gap-1.5"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 22 }}
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            openWindows={openWindows}
            onOpen={onOpen}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Dock;
