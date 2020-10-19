import { DragAndDrop } from 'facet-mobx/facets/DragAndDrop';
import { listen } from 'facet';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { MoveT } from 'src/moves/types';
import { createErrorHandler, getId } from 'src/app/utils';
import { apiSaveMoveOrdering } from 'src/move_lists/api';

export const handleSaveMoveOrderOnDrop = (moveListsStore: MoveListsStore) => (
  ctr: MovesContainer
) => {
  const dragAndDrop = DragAndDrop.get(ctr);
  listen(
    dragAndDrop,
    'drop',
    () => {
      const moves: MoveT[] = dragAndDrop.preview ?? [];
      const moveIds = moves.map((x) => x.id);
      moveListsStore.setMoveIds(getId(ctr.inputs.moveList), moveIds);
      apiSaveMoveOrdering(getId(ctr.inputs.moveList), moveIds).catch(
        createErrorHandler('We could not update the move list')
      );
    },
    { after: false }
  );
};
