import { describe, expect, it } from 'vitest';
import { planNotepadWindowTitleRepairs } from './window-title97';

describe('persisted Notepad window titles', () => {
  it('repairs only stale Notepad titles from their current VFS file names', () => {
    const repairs = planNotepadWindowTitleRepairs([
      { id: 'readme', appId: 'notepad', fileId: 'project-readme', title: 'README.txt' },
      { id: 'current', appId: 'notepad', fileId: 'skills', title: 'skills.txt' },
      { id: 'media', appId: 'media-player', fileId: 'demo', title: 'demo.avi' },
      { id: 'unbound', appId: 'notepad', title: 'Notepad' },
    ], new Map([
      ['project-readme', 'README.md'],
      ['skills', 'skills.txt'],
      ['demo', 'demo.mp4'],
    ]));

    expect(repairs).toEqual([{ windowId: 'readme', title: 'README.md' }]);
  });
});
