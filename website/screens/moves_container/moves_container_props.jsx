// @flow

import { createUUID, slugify } from "utils/utils";
import { apiSaveMoveOrdering, apiUpdateSourceMoveListId } from "move_lists/api";
import {
  actInsertMoveIds,
  actRemoveMoveIds,
  actSetMoveIds,
} from "move_lists/actions";
import { newMoveSlug } from "moves/utils";
import { actAddMoves } from "moves/actions";
import { apiSaveMove } from "moves/api";
import { createErrorHandler, getId } from "app/utils";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";

export function createNewMove(
  userProfile: ?UserProfileT,
  sourceMoveListId: UUID
): ?MoveT {
  if (!userProfile) {
    return null;
  }

  return {
    id: createUUID(),
    // id: "<<<      NEWMOVE      >>>",
    slug: newMoveSlug,
    link: "",
    name: "New move",
    description: "",
    startTimeMs: null,
    endTimeMs: null,
    tags: [],
    ownerId: userProfile.userId,
    ownerUsername: userProfile.username,
    sourceMoveListId: sourceMoveListId,
    privateData: null,
  };
}

export function movesContainerProps(
  dispatch: Function,
  storeLocationMemo: Function,
  restoreLocationMemo: Function
) {
  const setMoves = (moveList: MoveListT, moves: Array<MoveT>) => {
    const moveIds = moves.map(x => x.id);
    dispatch(actSetMoveIds(moveIds, getId(moveList)));
    apiSaveMoveOrdering(getId(moveList), moveIds).catch(
      createErrorHandler("We could not update the move list")
    );
  };

  function saveMove(move: MoveT, values: any) {
    const slug =
      values.slug == newMoveSlug ? slugify(values.name) : values.slug;

    const newMove = {
      ...move,
      ...values,
      slug,
    };

    dispatch(actAddMoves([newMove]));

    return apiSaveMove(newMove).catch(
      createErrorHandler("We could not save the move")
    );
  }

  function shareMovesToList(
    moves: Array<MoveT>,
    moveList: MoveListT,
    removeFromMoveList: ?MoveListT
  ) {
    const moveIdsInTargetMoveList = dispatch(
      actInsertMoveIds(moves.map(x => x.id), moveList.id, "", false)
    );
    apiSaveMoveOrdering(moveList.id, moveIdsInTargetMoveList).catch(
      createErrorHandler("Could not update the move list")
    );

    if (removeFromMoveList) {
      const removeFromMoveListId = removeFromMoveList.id;
      const selectedMoveIds: Array<UUID> = moves.map(x => x.id);

      const idsOfMovesWithNewSourceMoveList = moves
        .filter(x => x.sourceMoveListId == removeFromMoveListId)
        .map(x => x.id);

      apiUpdateSourceMoveListId(
        idsOfMovesWithNewSourceMoveList,
        moveList.id
      ).catch(createErrorHandler("Could not update move"));

      const newMoveIds = dispatch(
        actRemoveMoveIds(selectedMoveIds, removeFromMoveListId)
      );
      apiSaveMoveOrdering(removeFromMoveListId, newMoveIds).catch(
        createErrorHandler("Could not update the move list")
      );
    }
  }

  return {
    setMoves,
    saveMove,
    shareMovesToList,
    storeLocationMemo,
    restoreLocationMemo,
  };
}
