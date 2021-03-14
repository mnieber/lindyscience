import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MoveT } from 'src/moves/types';
import { getCtr } from 'facility';
import { createErrorHandler, getId } from 'src/app/utils';
import { apiSaveMoveOrdering } from 'src/move_lists/api';
import { Insertion } from 'facility-facets/Insertion';

export const handleInsertMoves = (
  facet: Insertion,
  moveListsStore: MoveListsStore,
  moves: MoveT[]
) => {
  const ctr = getCtr(facet);
  const moveIds = moves.map((x) => x.id);
  moveListsStore.setMoveIds(getId(ctr.inputs.moveList), moveIds);
  apiSaveMoveOrdering(getId(ctr.inputs.moveList), moveIds).catch(
    createErrorHandler('We could not update the move list')
  );
};
