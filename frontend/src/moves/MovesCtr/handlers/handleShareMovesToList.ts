import { MoveListsStore } from 'src/movelists/MoveListsStore';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { NavigationStore } from 'src/session/NavigationStore';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/movelists/types';
import {
  apiSaveMoveOrdering,
  apiUpdateSourceMoveListId,
} from 'src/movelists/api';
import { createErrorHandler } from 'src/app/utils';
import { UUID } from 'src/kernel/types';

export const handleShareMovesToList = (
  ctr: MovesContainer,
  navigationStore: NavigationStore,
  moveListsStore: MoveListsStore
) => {
  return (
    moves: Array<MoveT>,
    moveList: MoveListT,
    removeFromMoveList?: MoveListT
  ) => {
    const moveIdsInTargetMoveList = moveListsStore.insertMoveIds(
      moveList.id,
      moves.map((x) => x.id),
      '',
      false
    );

    apiSaveMoveOrdering(moveList.id, moveIdsInTargetMoveList).catch(
      createErrorHandler('Could not update the move list')
    );

    if (removeFromMoveList) {
      const removeFromMoveListId = removeFromMoveList.id;
      const selectedMoveIds: Array<UUID> = moves.map((x) => x.id);

      const idsOfMovesWithNewSourceMoveList = moves
        .filter((x) => x.sourceMoveListId === removeFromMoveListId)
        .map((x) => x.id);

      apiUpdateSourceMoveListId(
        idsOfMovesWithNewSourceMoveList,
        moveList.id
      ).catch(createErrorHandler('Could not update move'));

      const newMoveIds = moveListsStore.removeMoveIds(
        removeFromMoveListId,
        selectedMoveIds
      );
      apiSaveMoveOrdering(removeFromMoveListId, newMoveIds).catch(
        createErrorHandler('Could not update the move list')
      );

      navigationStore.navigateToMoveList(removeFromMoveList);
    }
  };
};
