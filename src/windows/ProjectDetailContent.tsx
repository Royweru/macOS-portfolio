'use client';

import { ArrowUpRight, ExternalLink, FileAudio, FileImage, FileVideo, FolderOpen, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import projectsData from '../data/projects_data.json';
import { getProjectMedia } from '../data/project-media-manifest';
import type { MediaAsset } from '../features/media/media-types';
import { VIRTUAL_PATHS } from '../features/filesystem/virtual-paths';

const projectPath = (title: string) => `${VIRTUAL_PATHS.projects}\\${title}`;

const mediaPath = (asset: MediaAsset) => {
  const folder = asset.kind === 'video' ? VIRTUAL_PATHS.videos : asset.kind === 'audio' ? VIRTUAL_PATHS.music : VIRTUAL_PATHS.pictures;
  const filename = decodeURIComponent(asset.source.split('/').pop() ?? asset.id);
  return `${folder}\\${filename}`;
};

function MediaIcon({ kind }: { kind: MediaAsset['kind'] }) {
  if (kind === 'video') return <FileVideo size={18} />;
  if (kind === 'audio') return <FileAudio size={18} />;
  return <FileImage size={18} />;
}

function ProjectThumbnail({ title, source }: { title: string; source?: string }) {
  const [failed, setFailed] = useState(false);
  if (!source || failed) {
    return <div className="project-detail-thumbnail project-detail-thumbnail-fallback" aria-label={`${title} thumbnail unavailable`}><FileImage size={38} /><span>PROJECT FILE</span></div>;
  }
  return <div className="project-detail-thumbnail"><img src={source} alt={`${title} preview`} onError={() => setFailed(true)} /><span>Project preview</span></div>;
}

export default function ProjectDetailContent({ projectId, onOpenMedia, onOpenFolder, onOpenTerminal }: { projectId?: number; onOpenMedia: (asset: MediaAsset) => void; onOpenFolder: (projectId: number) => void; onOpenTerminal: (path: string) => void }) {
  const project = projectsData.find(candidate => candidate.id === projectId);
  if (!project) return <div className="project-detail-empty">Project details are unavailable.</div>;

  const assets = getProjectMedia(project.id);
  const imageAsset = assets.find(asset => asset.kind === 'image');
  const posterAsset = assets.find(asset => asset.poster);
  const thumbnailSource = imageAsset?.source ?? posterAsset?.poster;

  return (
    <div className="project-detail-surface">
      <div className="project-detail-toolbar">
        <span className="project-detail-path"><FolderOpen size={15} /><span>{projectPath(project.title)}</span></span>
        <span className="project-detail-toolbar-actions">
          <button type="button" title="Open containing folder" onClick={() => onOpenFolder(project.id)}><FolderOpen size={15} /><span>Folder</span></button>
          <button type="button" title="Open in Terminal" onClick={() => onOpenTerminal(projectPath(project.title))}><TerminalSquare size={15} /><span>Terminal</span></button>
        </span>
      </div>

      <div className="project-detail-body">
        <header className="project-detail-header">
          <ProjectThumbnail title={project.title} source={thumbnailSource} />
          <div className="project-detail-heading">
            <span className="project-detail-eyebrow">Project workspace</span>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <span className="project-detail-tag">{project.tag}</span>
          </div>
        </header>

        <section className="project-detail-section" aria-labelledby="project-technology-heading">
          <h3 id="project-technology-heading">Technology</h3>
          <div className="project-detail-tech-list">{project.tech.map(technology => <span key={technology}>{technology}</span>)}</div>
        </section>

        <section className="project-detail-section" aria-labelledby="project-media-heading">
          <div className="project-detail-section-heading"><div><h3 id="project-media-heading">Project media</h3><p>Linked assets remain in the shared Weru OS media folders.</p></div><span>{assets.length} item{assets.length === 1 ? '' : 's'}</span></div>
          {assets.length === 0 ? <div className="project-detail-empty-media"><FileImage size={20} /><span>No media has been associated with this project yet.</span></div> : <div className="project-detail-media-list">{assets.map(asset => <article className="project-detail-media-item" key={asset.id}><span className="project-detail-media-icon"><MediaIcon kind={asset.kind} /></span><div className="project-detail-media-copy"><strong>{asset.title}</strong><span>{mediaPath(asset)}</span><small>{asset.description ?? `${asset.kind} asset`}</small></div>{asset.kind === 'video' && <video controls preload="metadata" poster={asset.poster} src={asset.source} aria-label={asset.title} />}{asset.kind === 'audio' && <audio controls preload="metadata" src={asset.source} aria-label={asset.title} />}<button type="button" className="project-detail-media-open" onClick={() => onOpenMedia(asset)} aria-label={`Open ${asset.title} in Media Player`}><ArrowUpRight size={15} /></button></article>)}</div>}
        </section>

        <section className="project-detail-section" aria-labelledby="project-links-heading">
          <h3 id="project-links-heading">Project links</h3>
          <div className="project-detail-links">
            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />Repository</a>}
            {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />Live project</a>}
            {!project.github && !project.live && <span className="project-detail-muted">No external links have been configured.</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
