import { describe, expect, it } from 'vitest';
import { createWin97Nodes } from './filesystem-service';
import { VIRTUAL_NODE_IDS, VIRTUAL_PATHS } from './virtual-paths';

describe('Weru 97 seeded filesystem topology', () => {
  const nodes = createWin97Nodes();
  const byId = new Map(nodes.map(node => [node.id, node]));

  it('keeps portfolio documents in My Documents and media libraries separate', () => {
    expect(byId.get(VIRTUAL_NODE_IDS.myDocuments)).toMatchObject({ parentId: VIRTUAL_NODE_IDS.root, name: 'My Documents' });
    expect(byId.get(VIRTUAL_NODE_IDS.videos)).toMatchObject({ parentId: VIRTUAL_NODE_IDS.root, name: 'Videos' });
    expect(byId.get(VIRTUAL_NODE_IDS.pictures)).toMatchObject({ parentId: VIRTUAL_NODE_IDS.root, name: 'My Pictures' });
    expect(byId.get('folder-images')).toMatchObject({ parentId: VIRTUAL_NODE_IDS.pictures, name: 'Screenshots' });

    const documentChildren = nodes.filter(node => node.parentId === VIRTUAL_NODE_IDS.myDocuments);
    expect(documentChildren.map(node => node.name).sort()).toEqual([
      'Resume.txt', 'about_me.txt', 'experience.txt', 'skills.txt',
    ]);
  });

  it('keeps desktop media shortcuts pointed at the same canonical library locations', () => {
    expect(VIRTUAL_PATHS.videos).toBe('C:\\Videos');
    expect(VIRTUAL_PATHS.pictures).toBe('C:\\My Pictures');
    expect(byId.get('desktop-lnk-videos')).toMatchObject({
      parentId: VIRTUAL_NODE_IDS.desktop,
      shortcutTargetId: VIRTUAL_NODE_IDS.videos,
      shortcutTargetPath: VIRTUAL_PATHS.videos,
    });
    expect(byId.get(VIRTUAL_NODE_IDS.desktopPicturesShortcut)).toMatchObject({
      parentId: VIRTUAL_NODE_IDS.desktop,
      shortcutTargetId: VIRTUAL_NODE_IDS.pictures,
      shortcutTargetPath: VIRTUAL_PATHS.pictures,
    });
  });
});
