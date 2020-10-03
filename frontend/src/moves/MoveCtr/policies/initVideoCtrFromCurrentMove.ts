// @flow

import { Inputs } from 'src/video/facets/Inputs';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import type { MoveT } from 'src/moves/types';
import { getVideoFromMove } from 'src/moves/utils';
import { mapDatas } from 'src/npm/facet-mobx';

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
