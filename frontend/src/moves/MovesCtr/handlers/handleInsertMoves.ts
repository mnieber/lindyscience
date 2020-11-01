import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MoveT } from 'src/moves/types';
import { getCtr } from 'facet';
import { createErrorHandler, getId } from 'src/app/utils';
import { apiSaveMoveOrdering } from 'src/move_lists/api';
import { DragT } from 'facet-mobx/facets/Insertion';
import { Insertion } from 'facet-mobx/facets/Insertion';

export const handleInsertMoves = (moveListsStore: MoveListsStore) =>
  function (this: Insertion, drag: DragT) {
    const ctr = getCtr(this);
    return (moves: MoveT[]) => {
      const moveIds = moves.map((x) => x.id);
      moveListsStore.setMoveIds(getId(ctr.inputs.moveList), moveIds);
      apiSaveMoveOrdering(getId(ctr.inputs.moveList), moveIds).catch(
        createErrorHandler('We could not update the move list')
      );
    };
  };
