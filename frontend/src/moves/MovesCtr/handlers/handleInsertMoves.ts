import { MoveListsStore } from 'src/movelists/MoveListsStore';
import { MoveT } from 'src/moves/types';
import { getc } from 'skandha';
import { createErrorHandler, getId } from 'src/app/utils';
import { apiSaveMoveOrdering } from 'src/movelists/api';
import { Insertion } from 'skandha-facets/Insertion';

export const handleInsertMoves = (
  facet: Insertion,
  moveListsStore: MoveListsStore,
  moves: MoveT[]
) => {
  const ctr = getc(facet);
  const moveIds = moves.map((x) => x.id);
  moveListsStore.setMoveIds(getId(ctr.inputs.moveList), moveIds);
  apiSaveMoveOrdering(getId(ctr.inputs.moveList), moveIds).catch(
    createErrorHandler('We could not update the move list')
  );
};
