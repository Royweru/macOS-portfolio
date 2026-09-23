'use client';

import Dexie, { type EntityTable } from 'dexie';
import type { MetaRecord, TrashEntry, VfsNode } from './filesystem-types';
import { getBrowserProfileId } from '../os/profile-storage';

export class PortfolioDatabase extends Dexie {
  nodes!: EntityTable<VfsNode, 'id'>;
  trash!: EntityTable<TrashEntry, 'id'>;
  meta!: EntityTable<MetaRecord, 'key'>;

  constructor(name = `weru-os-filesystem-${getBrowserProfileId()}`) {
    super(name);

    this.version(1).stores({
      nodes: 'id, parentId, kind, name, updatedAt',
      trash: 'id, deletedAt',
      meta: 'key',
    });
  }
}

export const filesystemDb = new PortfolioDatabase();
export const legacyFilesystemDb = new PortfolioDatabase('weru-os-filesystem');
