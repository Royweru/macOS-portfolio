import { WINDOW_CONFIGS } from '../constants';
import type { WindowInstance } from '../features/os/os-types';
import type { WindowId } from '../types';

export interface WindowControlPolicy97 {
  canClose: boolean;
  canMinimize: boolean;
  canMaximize: boolean;
  showMaximize: boolean;
}

/** Combines persisted per-instance state with non-negotiable source restrictions. */
export function getWindowControlPolicy97(instance: WindowInstance): WindowControlPolicy97 {
  const sourceConfig = WINDOW_CONFIGS[instance.appId as WindowId];
  return {
    canClose: instance.canClose,
    canMinimize: instance.canMinimize && sourceConfig?.canMinimize !== false,
    canMaximize: instance.canMaximize && sourceConfig?.canMaximize !== false,
    showMaximize: instance.showMaximize !== false && sourceConfig?.showMaximize !== false,
  };
}
