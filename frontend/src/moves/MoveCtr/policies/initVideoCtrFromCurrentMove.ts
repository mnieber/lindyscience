import { Inputs } from 'src/video/facets/Inputs';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { MoveT } from 'src/moves/types';
import { getVideoFromMove } from 'src/moves/utils';
import { getm, mapDatas } from 'skandha';

export const initVideoCtrFromCurrentMove = mapDatas(
  [
    //
    getm([Inputs, 'move']),
    getm([Inputs, 'altLink']),
  ],
  [VideoController, 'video'],
  (move: MoveT, altLink: string | undefined) => {
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
