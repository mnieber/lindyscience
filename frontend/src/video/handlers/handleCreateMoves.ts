import { MoveListsStore } from 'src/movelists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { CutPointT } from 'src/video/types';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/movelists/types';
import { isNone } from 'src/utils/utils';
import { createMoveFromCutPoint } from 'src/app/utils';
import { apiSaveMove } from 'src/moves/api';
import { createErrorHandler } from 'src/app/utils';
import { apiSaveMoveOrdering } from 'src/movelists/api';
import { UserProfileT } from 'src/profiles/types';

const saveMoves = (
  moveListsStore: MoveListsStore,
  movesStore: MovesStore,
  newMoves: Array<MoveT>,
  moveList: MoveListT
) => {
  const lastMoveIdx = moveList.moves.length - 1;
  const lastMoveId = lastMoveIdx >= 0 ? moveList.moves[lastMoveIdx] : '';

  movesStore.addMoves(newMoves);
  const moveIdsInMoveList = moveListsStore.insertMoveIds(
    moveList.id,
    newMoves.map((x) => x.id),
    lastMoveId,
    false
  );

  newMoves.forEach((newMove) => {
    apiSaveMove(newMove).catch(
      createErrorHandler('We could not save the move')
    );
  });

  apiSaveMoveOrdering(moveList.id, moveIdsInMoveList).catch(
    createErrorHandler('We could not update the movelist')
  );
};

export const handleCreateMoves = (
  cutPointsStore: CutPointsStore,
  moveListsStore: MoveListsStore,
  movesStore: MovesStore,
  moveList: MoveListT,
  userProfile: UserProfileT
) => {
  const newMoves: Array<MoveT> = cutPointsStore.cutPoints.reduce(
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
                cutPointsStore.videoLink,
                userProfile,
                moveList
              ),
            ];

      return [...acc.slice(0, lastMoveIdx), ...lastMoveArray, ...newMoveArray];
    },
    []
  );

  return saveMoves(moveListsStore, movesStore, newMoves, moveList);
};
