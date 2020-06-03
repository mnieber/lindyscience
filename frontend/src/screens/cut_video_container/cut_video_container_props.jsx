// @flow

import { MovesStore } from 'src/moves/MovesStore';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { apiSaveMove } from 'src/moves/api';
import { createErrorHandler } from 'src/app/utils';
import { apiSaveMoveOrdering } from 'src/move_lists/api';
import type { MoveT } from 'src/moves/types';
import type { MoveListT } from 'src/move_lists/types';

export function cutVideoContainerProps(
  moveListsStore: MoveListsStore,
  movesStore: MovesStore
) {
  const saveMoves = (newMoves: Array<MoveT>, moveList: MoveListT) => {
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
      apiSaveMoveOrdering(moveList.id, moveIdsInMoveList).catch(
        createErrorHandler('We could not update the movelist')
      );
    });
  };

  return {
    saveMoves,
    rootDivId: 'cutVideoPanel',
  };
}
