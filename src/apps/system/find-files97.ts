import { searchNodes } from '../../features/filesystem/filesystem-service';
import type { VfsNode } from '../../features/filesystem/filesystem-types';

export type FindNodes97 = (query: string) => Promise<VfsNode[]>;

export function findFiles97(query: string, search: FindNodes97 = searchNodes): Promise<VfsNode[]> {
  const normalized = query.trim();
  return normalized ? search(normalized) : Promise.resolve([]);
}
