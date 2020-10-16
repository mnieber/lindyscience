import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { MoveT } from 'src/moves/types';
import { createErrorHandler, getId } from 'src/app/utils';
import { apiSaveMoveOrdering } from 'src/move_lists/api';

export const handleInsertMoves = (
  ctr: MovesContainer,
  moveListsStore: MoveListsStore
) => {
  return (moves: MoveT[]) => {
    const moveIds = moves.map((x) => x.id);
    moveListsStore.setMoveIds(getId(ctr.inputs.moveList), moveIds);
    apiSaveMoveOrdering(getId(ctr.inputs.moveList), moveIds).catch(
      createErrorHandler('We could not update the move list')
    );
  };
};
