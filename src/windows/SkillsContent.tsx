// ─── windows/SkillsContent.tsx ────────────────────────────────────────────────
import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '../constants';
import '../styles/tokens.css';

const SkillBar: React.FC<{ name: string; level: number; color: string; delay: number }> = ({ name, level, color, delay }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[12px] font-medium text-gray-700">{name}</span>
      <span className="text-[11px] text-gray-400">{level}%</span>
    </div>
    <div className="skill-track">
      <motion.div
        className="skill-fill"
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: color }}
      />
    </div>
  </div>
);

const SkillsContent: React.FC = () => (
  <div className="window-content px-6 py-5">
    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
      {SKILLS.map((group, gi) => (
        <motion.div
          key={group.category}
          className="card-surface p-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.07 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{group.icon}</span>
            <h3 className="text-[13px] font-semibold text-gray-800">{group.category}</h3>
          </div>
          {group.skills.map((s, si) => (
            <SkillBar key={s.name} {...s} delay={gi * 0.07 + si * 0.06} />
          ))}
        </motion.div>
      ))}
    </div>
  </div>
);

export default SkillsContent;
