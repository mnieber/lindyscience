export const newMoveSlug = "new-move";

import type { VideoT } from "video/types";
import type { MoveT } from "move/types";

export function getVideoFromMove(move: MoveT): VideoT {
  const { link, startTimeMs, endTimeMs, id } = move;
  return { link, startTimeMs, endTimeMs, id };
}
