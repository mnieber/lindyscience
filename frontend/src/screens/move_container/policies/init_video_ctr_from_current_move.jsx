// @flow

import { Inputs } from 'src/screens/move_container/facets/inputs';
import { mapDatas } from 'src/facet-mobx';
import { VideoController } from 'src/screens/move_container/facets/video_controller';
import type { MoveT } from 'src/moves/types';
import { getVideoFromMove } from 'src/moves/utils';

export const initVideoCtrFromCurrentMove = mapDatas(
  [
    [Inputs, 'move'],
    [Inputs, 'altLink'],
  ],
  [VideoController, 'video'],
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
