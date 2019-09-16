export const newMoveSlug = "new-move";

import type { VideoT } from "video/types";
import type { MoveT } from "move/types";

export function getVideoFromMove(move: MoveT): VideoT {
  const { link, startTime, endTime } = move;
  return { link, startTime, endTime };
}
