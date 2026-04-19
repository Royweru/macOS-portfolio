import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitFork, ExternalLink, Plus } from 'lucide-react';
import projectsData from '../data/projects_data.json';



const tagClass: Record<string, string> = {
  AI:     'tag-badge tag-ai',
  Dev:    'tag-badge tag-dev',
  Design: 'tag-badge tag-design',
  Archived:'tag-badge tag-archived',
};

const ProjectCard: React.FC<{ project: typeof projectsData[0]; view: 'grid'|'list' }> = ({ project, view }) => {
  const [hovered, setHovered] = useState(false);

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 px-4 py-3 hover:bg-black/4 border-b border-black/5 cursor-pointer group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: project.color }}
        >
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-800 truncate">{project.title}</p>
          <p className="text-[11px] text-gray-500 truncate">{project.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={tagClass[project.tag] ?? 'tag-badge'}>{project.tag}</span>
          <div className={`flex gap-1 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer"
                className="p-1 rounded hover:bg-black/8" onClick={e => e.stopPropagation()}>
                <GitFork size={13} className="text-gray-600" />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer"
                className="p-1 rounded hover:bg-black/8" onClick={e => e.stopPropagation()}>
                <ExternalLink size={13} className="text-gray-600" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card preview area */}
      <div
        className="h-[130px] flex items-center justify-center relative overflow-hidden"
        style={{ background: project.color }}
      >
        <span className="text-5xl filter drop-shadow-lg">{project.icon}</span>

        {/* Accent glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(circle at 70% 30%, ${project.accent}, transparent 60%)` }}
        />

        {/* Tech chips on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-2 left-2 flex gap-1 flex-wrap"
            >
              {project.tech.slice(0, 3).map(t => (
                <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-medium text-white/90"
                  style={{ background: 'rgba(0,0,0,0.45)' }}>
                  {t}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Links badge */}
        <div className="absolute top-2 right-2 flex gap-1">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer"
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={e => e.stopPropagation()}>
              <GitFork size={11} color="white" />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer"
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={e => e.stopPropagation()}>
              <ExternalLink size={11} color="white" />
            </a>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div className="bg-white px-3 py-2.5">
        <p className="text-[12.5px] font-semibold text-gray-800 truncate">{project.title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className={tagClass[project.tag] ?? 'tag-badge'}>{project.tag}</span>
        </div>
      </div>
    </motion.div>
  );
};

interface ProjectsContentProps {
  sidebarSection: string;
  viewMode: 'grid' | 'list';
}

const ProjectsContent: React.FC<ProjectsContentProps> = ({ sidebarSection, viewMode }) => {
  const [search, setSearch] = useState('');

  const filtered = projectsData.filter(p => {
    const matchTag =
      sidebarSection === 'main' || sidebarSection === 'recent' || sidebarSection === 'starred'
        ? true
        : p.tag.toLowerCase() === sidebarSection.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/5 bg-white/40">
        <div className="flex-1 flex items-center gap-2 bg-black/5 rounded-lg px-3 py-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="bg-transparent text-[12px] text-gray-700 outline-none w-full placeholder-gray-400"
            style={{ userSelect: 'text' }}
          />
        </div>
        <span className="text-[11px] text-gray-400">{filtered.length} items</span>
      </div>

      {/* Grid or List */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-3 gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            <AnimatePresence>
              {filtered.map(p => <ProjectCard key={p.id} project={p} view="grid" />)}
            </AnimatePresence>

            {/* New project placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border-2 border-dashed border-gray-200 h-[175px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
            >
              <Plus size={20} className="text-gray-300" />
              <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">New Project</span>
            </motion.div>
          </div>
        ) : (
          <div className="py-1">
            {filtered.map(p => <ProjectCard key={p.id} project={p} view="list" />)}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-4 py-1.5 border-t border-black/5 bg-white/30 text-[11px] text-gray-400">
        {filtered.length} items · weru.dev/projects
      </div>
    </div>
  );
};

export default ProjectsContent;
