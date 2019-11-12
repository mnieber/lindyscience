// @flow

export const newMoveSlug = "new-move";
export const helpUrl = "/app/lists/lindyscience/help/welcome-to-lindy-science";

import type { VideoT } from "video/types";
import type { MoveT } from "moves/types";

export function getVideoFromMove(move: MoveT): VideoT {
  const { link, startTimeMs, endTimeMs } = move;
  return { link, startTimeMs, endTimeMs };
}
