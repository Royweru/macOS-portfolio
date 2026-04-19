// ─── windows/ExperienceContent.tsx ───────────────────────────────────────────
import React from 'react';
import { motion } from 'framer-motion';
import { JOBS } from '../constants';
import '../styles/tokens.css';

const ExperienceContent: React.FC = () => (
  <div className="window-content px-6 py-5">
    <div className="relative">
      <div className="timeline-line" />
      {JOBS.map((job, i) => (
        <motion.div
          key={job.company}
          className="flex gap-4 mb-6 relative"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.42 }}
        >
          {/* Icon bubble */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm z-10"
            style={{ background: job.color }}
          >
            {job.icon}
          </div>

          {/* Card */}
          <div className="card-surface flex-1 p-4">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[13.5px] font-bold text-gray-800">{job.role}</h3>
                  {job.current && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">Current</span>
                  )}
                </div>
                <p className="text-[12px] font-semibold mt-0.5" style={{ color: job.color }}>{job.company}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] font-medium text-gray-500">{job.period}</p>
                <p className="text-[11px] text-gray-400">{job.location}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {job.bullets.map((b, bi) => (
                <li key={bi} className="flex gap-2 text-[12px] text-gray-600 leading-snug">
                  <span className="mt-0.5 shrink-0" style={{ color: job.color }}>▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ExperienceContent;
