import { describe, expect, it } from 'vitest';
import { createWin97Nodes } from '../filesystem/filesystem-service';
import { PROJECTS } from '../../data/portfolio-manifest';
import { mediaAssetFromVfsNode97, selectWindowMediaAsset97 } from './window-media-asset97';

describe('VFS media asset routing for app windows', () => {
  const nodes = createWin97Nodes();

  it('maps every seeded project demo to its manifest-backed player source', () => {
    const demoProjects = PROJECTS.filter(project => project.files?.demo);
    expect(demoProjects.length).toBeGreaterThan(0);

    for (const project of demoProjects) {
      const node = nodes.find(candidate => candidate.id === `project-${project.id}-demo`);
      expect(mediaAssetFromVfsNode97(node)).toMatchObject({
        id: `${project.id}-demo`,
        projectId: project.legacyId ?? 0,
        kind: 'video',
        source: project.files!.demo!.src,
        mimeType: project.files!.demo!.mimeType ?? 'video/mp4',
      });
    }
  });

  it('does not show a previously selected asset while a file-bound node is unresolved', () => {
    const staleAsset = { id: 'old', projectId: 3, kind: 'video' as const, title: 'Old video', source: '/media/videos/gigaclaw.mp4', mimeType: 'video/mp4' };

    expect(selectWindowMediaAsset97('project-afyatrack-demo', undefined, staleAsset)).toBeUndefined();
  });

  it('uses only the matching file node in a file-bound window', () => {
    const node = nodes.find(candidate => candidate.id === 'project-afyatrack-demo');
    const staleAsset = { id: 'old', projectId: 3, kind: 'video' as const, title: 'Old video', source: '/media/videos/gigaclaw.mp4', mimeType: 'video/mp4' };

    expect(selectWindowMediaAsset97('project-afyatrack-demo', node, staleAsset)?.source).toBe('/media/videos/afya_track.mp4');
    expect(selectWindowMediaAsset97('project-afyatrack-demo', nodes.find(candidate => candidate.id === 'project-gigaclaw-agent-demo'), staleAsset)).toBeUndefined();
  });

  it('retains the fallback asset for a player launched without a file association', () => {
    const fallbackAsset = { id: 'library', projectId: 0, kind: 'video' as const, title: 'Library video', source: '/media/videos/gigaclaw.mp4', mimeType: 'video/mp4' };

    expect(selectWindowMediaAsset97(undefined, undefined, fallbackAsset)).toBe(fallbackAsset);
  });
});
