import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getProjectDocumentNotepadRect97,
  getProjectFolderExplorerRect97,
  getExplorerNavigationRect97,
  getStitchProjectExplorerRect97,
  getStitchProjectNotepadRect97,
} from './project-window-geometry97';

const stitch = readFileSync(resolve(process.cwd(), 'Stitch Designs', 'html', 'windows_97_project_explorer_and_notepad_view.html'), 'utf8');
const wideViewport = { width: 1422, workAreaHeight: 598, viewportHeight: 644 };
const narrowViewport = { width: 600, workAreaHeight: 722, viewportHeight: 768 };

describe('project Explorer and Notepad geometry against Stitch', () => {
  it('matches source-authored wide-screen anchors and dimensions', () => {
    expect(stitch).toMatch(/left-\[88px\] top-\[26px\] w-\[90vw\] max-w-\[620px\] h-\[430px\][^>]*id="window-explorer"/);
    expect(stitch).toMatch(/md:left-\[320px\] md:top-\[90px\] w-\[95vw\] max-w-\[580px\] h-\[450px\][^>]*id="window-notepad"/);
    expect(getStitchProjectExplorerRect97(0, wideViewport)).toEqual({ x: 88, y: 26, width: 620, height: 430 });
    expect(getStitchProjectNotepadRect97(0, wideViewport)).toEqual({ x: 320, y: 90, width: 580, height: 450 });
  });

  it('cascades repeated project windows without replacing the first source placement', () => {
    expect(getStitchProjectExplorerRect97(44, wideViewport)).toEqual({ x: 132, y: 70, width: 620, height: 430 });
    expect(getStitchProjectNotepadRect97(44, wideViewport)).toEqual({ x: 364, y: 134, width: 580, height: 450 });
  });

  it('applies the source width proportions and keeps both windows inside a narrow work area', () => {
    expect(getStitchProjectExplorerRect97(0, narrowViewport)).toEqual({ x: 60, y: 26, width: 540, height: 430 });
    expect(getStitchProjectNotepadRect97(0, narrowViewport)).toEqual({ x: 30, y: 110, width: 570, height: 450 });
  });

  it('routes project folders and documents to source geometry without changing system folders or personal documents', () => {
    expect(getProjectFolderExplorerRect97('project-adventures', 0, wideViewport)).toEqual({ x: 88, y: 26, width: 620, height: 430 });
    expect(getProjectFolderExplorerRect97('folder-projects', 0, wideViewport)).toBeUndefined();
    expect(getProjectFolderExplorerRect97('folder-my-documents', 0, wideViewport)).toBeUndefined();
    expect(getProjectDocumentNotepadRect97({ id: 'project-adventures-readme', parentId: 'project-adventures' }, 0, wideViewport))
      .toEqual({ x: 320, y: 90, width: 580, height: 450 });
    expect(getProjectDocumentNotepadRect97({ id: 'file-about-me', parentId: 'folder-my-documents' }, 0, wideViewport)).toBeUndefined();
  });

  it('uses the correct Stitch layout as an Explorer navigates between system and project folders', () => {
    const windows = [
      { id: 'explorer-projects', appId: 'explorer', locationId: 'folder-projects' },
      { id: 'explorer-other-project', appId: 'explorer', locationId: 'project-afyatrack' },
      { id: 'notepad-readme', appId: 'notepad', locationId: 'project-adventures' },
    ];

    expect(getExplorerNavigationRect97('project-adventures', windows, 'explorer-projects', wideViewport))
      .toEqual({ x: 132, y: 70, width: 620, height: 430 });
    expect(getExplorerNavigationRect97('folder-projects', windows, 'explorer-other-project', wideViewport))
      .toEqual({ x: 240, y: 90, width: 660, height: 440 });
    expect(getExplorerNavigationRect97('folder-windows-system', windows, 'explorer-projects', wideViewport))
      .toBeUndefined();
  });
});
