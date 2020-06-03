// @flow

import { MovesStore } from 'src/moves/MovesStore';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { Navigation } from 'src/screens/session_container/facets/navigation';
import { createUUID, slugify } from 'src/utils/utils';
import {
  apiSaveMoveOrdering,
  apiUpdateSourceMoveListId,
} from 'src/move_lists/api';
import { newMoveSlug } from 'src/moves/utils';
import { apiSaveMove } from 'src/moves/api';
import { createErrorHandler, getId } from 'src/app/utils';
import type { UUID } from 'src/kernel/types';
import type { UserProfileT } from 'src/profiles/types';
import type { MoveT } from 'src/moves/types';
import type { MoveListT } from 'src/move_lists/types';

export function createNewMove(
  userProfile: UserProfileT,
  sourceMoveListId: UUID
): MoveT {
  return {
    id: createUUID(),
    // id: "<<<      NEWMOVE      >>>",
    slug: newMoveSlug,
    link: '',
    name: 'New move',
    description: '',
    startTimeMs: null,
    endTimeMs: null,
    tags: [],
    ownerId: userProfile.userId,
    ownerUsername: userProfile.username,
    sourceMoveListId: sourceMoveListId,
  };
}

export function movesContainerProps(
  navigation: Navigation,
  moveListsStore: MoveListsStore,
  movesStore: MovesStore
) {
  const setMoves = (moveList: MoveListT, moves: Array<MoveT>) => {
    const moveIds = moves.map((x) => x.id);
    moveListsStore.setMoveIds(getId(moveList), moveIds);
    apiSaveMoveOrdering(getId(moveList), moveIds).catch(
      createErrorHandler('We could not update the move list')
    );
  };

  function saveMove(move: MoveT, values: any) {
    const isNewMove = values.slug == newMoveSlug;
    const slug = isNewMove ? slugify(values.name) : values.slug;

    const newMove = {
      ...move,
      ...values,
      slug,
    };

    movesStore.addMoves([newMove]);

    apiSaveMove(newMove).catch(
      createErrorHandler('We could not save the move')
    );

    if (isNewMove) {
      navigation.navigateToMove(newMove);
    }
  }

  function shareMovesToList(
    moves: Array<MoveT>,
    moveList: MoveListT,
    removeFromMoveList: ?MoveListT
  ) {
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
        .filter((x) => x.sourceMoveListId == removeFromMoveListId)
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

      navigation.navigateToMoveList(removeFromMoveList);
    }
  }

  function isEqual(lhs: any, rhs: any): boolean {
    return lhs.id == rhs.id;
  }

  return {
    isEqual,
    createNewMove,
    setMoves,
    saveMove,
    shareMovesToList,
    navigation,
  };
}
