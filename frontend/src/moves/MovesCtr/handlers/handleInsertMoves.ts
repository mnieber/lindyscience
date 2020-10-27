import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { MoveT } from 'src/moves/types';
import { createErrorHandler, getId } from 'src/app/utils';
import { apiSaveMoveOrdering } from 'src/move_lists/api';
import { DragT } from 'facet-mobx/facets/Insertion';

export const handleInsertMoves = (
  ctr: MovesContainer,
  moveListsStore: MoveListsStore
) => (drag: DragT, moves: MoveT[]) => {
  const moveIds = moves.map((x) => x.id);
  moveListsStore.setMoveIds(getId(ctr.inputs.moveList), moveIds);
  apiSaveMoveOrdering(getId(ctr.inputs.moveList), moveIds).catch(
    createErrorHandler('We could not update the move list')
  );
};
