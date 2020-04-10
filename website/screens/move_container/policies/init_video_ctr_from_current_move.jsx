// @flow

import { Inputs } from "screens/move_container/facets/inputs";
import { mapDatas } from "facet-mobx";
import { VideoController } from "screens/move_container/facets/video_controller";
import type { MoveT } from "moves/types";
import { getVideoFromMove } from "moves/utils";
import { MoveContainer } from "screens/move_container/move_container";

export const initVideoCtrFromCurrentMove = mapDatas(
  [
    [Inputs, "move"],
    [Inputs, "altLink"],
  ],
  [VideoController, "video"],
  (move: MoveT, altLink: string) => {
    return altLink
      ? {
          link: altLink,
          startTimeMs: undefined,
          endTimeMs: undefined,
        }
      : move && move.link
      ? getVideoFromMove(move)
      : null;
  }
);
