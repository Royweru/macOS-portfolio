import { VIRTUAL_NODE_IDS } from '../filesystem/virtual-paths';
import {
  STITCH_DESKTOP_EXPLORER_RECT,
  STITCH_EXPLORER_COMPUTER_RECT,
  STITCH_EXPLORER_PROJECTS_RECT,
} from '../../wm/geometry97';

/** Return the authored first-open rectangle for the three named Stitch Explorer states. */
export function getStitchExplorerRect97(locationId: string) {
  if (locationId === VIRTUAL_NODE_IDS.root) return STITCH_EXPLORER_COMPUTER_RECT;
  if (locationId === VIRTUAL_NODE_IDS.projects) return STITCH_EXPLORER_PROJECTS_RECT;
  if (locationId === VIRTUAL_NODE_IDS.myDocuments) return STITCH_DESKTOP_EXPLORER_RECT;
  return undefined;
}
