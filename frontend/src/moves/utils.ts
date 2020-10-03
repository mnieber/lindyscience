import { MoveT } from 'src/moves/types';
import { VideoT } from 'src/video/types';

export const newMoveSlug = 'new-move';
export const helpUrl = '/lists/lindyscience/help/welcome-to-lindy-science';

export function getVideoFromMove(move: MoveT): VideoT {
  const { link, startTimeMs, endTimeMs } = move;
  return { link, startTimeMs, endTimeMs };
}
