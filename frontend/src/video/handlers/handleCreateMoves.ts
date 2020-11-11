import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { CutPointT } from 'src/video/types';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { getCtr } from 'facet';
import { isNone } from 'src/utils/utils';
import { createMoveFromCutPoint } from 'src/app/utils';

export const handleCreateMoves = (
  saveMoves: (moves: Array<MoveT>, moveList: MoveListT) => any
) =>
  function (this: CutPointsStore) {
    const ctr = getCtr(this);

    const moveList = ctr.inputs.moveList;
    if (!moveList) {
      throw Error('No movelist');
    }

    const userProfile = ctr.inputs.userProfile;
    if (!userProfile) {
      throw Error('No userProfile');
    }

    const newMoves: Array<MoveT> = this.cutPoints.reduce(
      (acc: any, cutPoint: CutPointT) => {
        const lastMoveIdx = acc.length - 1;
        const lastMove = acc.length ? acc[lastMoveIdx] : undefined;
        const lastMoveArray =
          lastMove && isNone(lastMove.endTimeMs)
            ? [{ ...lastMove, endTimeMs: cutPoint.t * 1000 }]
            : lastMove
            ? [lastMove]
            : [];

        const newMoveArray =
          cutPoint.type === 'end'
            ? []
            : [
                createMoveFromCutPoint(
                  cutPoint,
                  this.videoLink,
                  userProfile,
                  moveList
                ),
              ];

        return [
          ...acc.slice(0, lastMoveIdx),
          ...lastMoveArray,
          ...newMoveArray,
        ];
      },
      []
    );
    return saveMoves(newMoves, moveList);
  };
