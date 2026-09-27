export type RecycleBinEmptyingAction97 = 'empty' | 'delete';

/** True when a successful destructive action leaves no deleted entries behind. */
export function actionLeavesRecycleBinEmpty97(action: RecycleBinEmptyingAction97, entryCountBeforeAction: number): boolean {
  if (entryCountBeforeAction <= 0) return false;
  return action === 'empty' || (action === 'delete' && entryCountBeforeAction === 1);
}
