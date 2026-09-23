'use client';

import { useMemo, useState } from 'react';
import type { FC } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Code2,
  ExternalLink,
  FileCode2,
  FolderKanban,
  FolderOpen,
  Globe2,
  Grid2X2,
  List,
  MoreHorizontal,
  Search,
  Star,
} from 'lucide-react';
import projectsData from '../data/projects_data.json';
import { getProjectMedia } from '../data/project-media-manifest';

type ViewMode = 'grid' | 'list';
type Project = typeof projectsData[number];

const tagTone: Record<string, string> = {
  AI: 'portfolio-tag portfolio-tag-ai',
  Dev: 'portfolio-tag portfolio-tag-dev',
  Design: 'portfolio-tag portfolio-tag-design',
  Archived: 'portfolio-tag portfolio-tag-archived',
};

function ProjectGlyph({ project, size = 22 }: { project: Project; size?: number }) {
  const Icon = project.tag === 'Design' ? Globe2 : project.tag === 'AI' ? Code2 : FileCode2;
  return (
    <span className="portfolio-file-glyph">
      <Icon size={size} strokeWidth={1.8} />
    </span>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const thumbnail = getProjectMedia(project.id).find(asset => asset.kind === 'image')?.source;
  return (
    <div className="portfolio-project-preview">
      {thumbnail && !imageFailed ? <img src={thumbnail} alt={`${project.title} thumbnail`} onError={() => setImageFailed(true)} /> : <><div className="portfolio-preview-grid" aria-hidden="true" /><ProjectGlyph project={project} size={30} /><span className="portfolio-preview-label">PROJECT FILE</span></>}
    </div>
  );
}

interface ProjectsContentProps {
  sidebarSection: string;
  viewMode: ViewMode;
  onOpenProject: (projectId: number) => void;
}

const ProjectsContent: FC<ProjectsContentProps> = ({ sidebarSection, viewMode: initialViewMode, onOpenProject }) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [section, setSection] = useState(sidebarSection);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projectsData
      .filter(project => {
        const matchesTag = section === 'main' || section === 'recent' || section === 'starred'
          ? true
          : project.tag.toLowerCase() === section.toLowerCase();
        const searchable = `${project.title} ${project.description} ${project.tag} ${project.tech.join(' ')}`.toLowerCase();
        return matchesTag && (!query || searchable.includes(query));
      })
      .sort((a, b) => sortBy === 'name' ? a.title.localeCompare(b.title) : a.tag.localeCompare(b.tag));
  }, [search, section, sortBy]);

  const selected = projectsData.find(project => project.id === selectedId);
  const openProject = (project: Project) => onOpenProject(project.id);

  return (
    <div className="portfolio-explorer" onClick={() => sortOpen && setSortOpen(false)}>
      <div className="portfolio-commandbar">
        <button type="button" className="portfolio-icon-button" aria-label="Back" disabled><ArrowLeft size={16} /></button>
        <button type="button" className="portfolio-icon-button" aria-label="Forward" disabled><ArrowRight size={16} /></button>
        <button type="button" className="portfolio-icon-button" aria-label="Up one level"><ChevronRight size={16} className="rotate-180" /></button>
        <span className="portfolio-command-divider" />
        <button type="button" className="portfolio-command-button"><FolderOpen size={15} /><span>New</span><ChevronDown size={13} /></button>
        <button type="button" className="portfolio-command-button"><MoreHorizontal size={16} /><span>More</span></button>
        <div className="portfolio-command-spacer" />
        <div className="portfolio-sort-wrap">
          <button type="button" className="portfolio-command-button portfolio-sort-button" onClick={event => { event.stopPropagation(); setSortOpen(value => !value); }}><span>Sort: {sortBy === 'name' ? 'Name' : 'Type'}</span><ChevronDown size={13} /></button>
          {sortOpen && <div className="portfolio-sort-menu" role="menu"><button type="button" onClick={() => { setSortBy('name'); setSortOpen(false); }}>Name</button><button type="button" onClick={() => { setSortBy('type'); setSortOpen(false); }}>Type</button></div>}
        </div>
        <div className="portfolio-view-toggle" aria-label="View mode">
          <button type="button" className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} aria-label="Icon view"><Grid2X2 size={15} /></button>
          <button type="button" className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label="List view"><List size={15} /></button>
        </div>
      </div>

      <div className="portfolio-addressbar">
        <div className="portfolio-breadcrumb"><FolderOpen size={15} /><span>Weru OS</span><ChevronRight size={13} /><strong>Projects</strong></div>
        <label className="portfolio-searchbox"><Search size={15} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search Projects" aria-label="Search projects" /></label>
      </div>

      <div className="portfolio-explorer-layout">
        <aside className="portfolio-quick-access" aria-label="Quick access">
          <span className="portfolio-sidebar-label">Quick access</span>
          {[
            { label: 'Home', icon: FolderOpen, active: false, value: 'main' },
            { label: 'Projects', icon: FolderKanban, active: section === 'main', value: 'main' },
            { label: 'Recent', icon: FolderOpen, active: section === 'recent', value: 'recent' },
            { label: 'Starred', icon: Star, active: section === 'starred', value: 'starred' },
          ].map(item => { const Icon = item.icon; return <button type="button" key={item.label} className={`portfolio-quick-item ${item.active ? 'active' : ''}`} onClick={() => setSection(item.value)}><Icon size={16} /><span>{item.label}</span></button>; })}
          <span className="portfolio-sidebar-label portfolio-sidebar-label-spaced">Tags</span>
          {['AI', 'Dev', 'Design'].map(tag => <button type="button" key={tag} className={`portfolio-quick-item ${section === tag.toLowerCase() ? 'active' : ''}`} onClick={() => setSection(tag.toLowerCase())}><span className={`portfolio-tag-dot portfolio-tag-dot-${tag.toLowerCase()}`} /><span>{tag}</span></button>)}
          <div className="portfolio-sidebar-note"><span className="portfolio-status-dot" /> Available for work</div>
        </aside>

        <main className="portfolio-project-area">
          <div className="portfolio-project-heading"><div><p className="portfolio-eyebrow">Portfolio workspace</p><h2>Projects</h2></div><span className="portfolio-item-count">{filtered.length} items</span></div>

          {viewMode === 'grid' ? (
            <div className="portfolio-project-grid">
              {filtered.map(project => <button type="button" key={project.id} className={`portfolio-project-card ${selectedId === project.id ? 'selected' : ''}`} onClick={() => { setSelectedId(project.id); openProject(project); }} onDoubleClick={() => openProject(project)}><ProjectPreview project={project} /><span className="portfolio-project-card-body"><span className="portfolio-project-title">{project.title}</span><span className="portfolio-project-description">{project.description}</span><span className={tagTone[project.tag] ?? 'portfolio-tag'}>{project.tag}</span></span></button>)}
            </div>
          ) : (
            <div className="portfolio-project-list" role="table" aria-label="Projects">
              <div className="portfolio-list-header" role="row"><span>Name</span><span>Type</span><span>Technologies</span><span>Open</span></div>
              {filtered.map(project => <button type="button" role="row" key={project.id} className={`portfolio-project-row ${selectedId === project.id ? 'selected' : ''}`} onClick={() => { setSelectedId(project.id); openProject(project); }} onDoubleClick={() => openProject(project)}><span className="portfolio-list-name"><ProjectGlyph project={project} size={18} /><span>{project.title}</span></span><span>{project.tag} project</span><span className="portfolio-tech-list">{project.tech.slice(0, 3).join(' · ')}</span><span>{project.live || project.github ? <ExternalLink size={15} /> : '—'}</span></button>)}
            </div>
          )}

          {filtered.length === 0 && <div className="portfolio-empty-state"><Search size={26} /><strong>No projects found</strong><span>Try a different name, tag, or technology.</span></div>}
        </main>
      </div>

      <div className="portfolio-explorer-status"><span>{filtered.length} item{filtered.length === 1 ? '' : 's'}</span><span className="portfolio-status-selection">{selected ? `${selected.title} · Project details opened` : 'Select a project to inspect it'}</span></div>
    </div>
  );
};

export default ProjectsContent;
