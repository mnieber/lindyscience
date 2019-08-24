// @flow

import * as React from "react";

import * as moveListsApi from "move_lists/api";

import { findNeighbourIdx } from "screens/utils";
import { createErrorHandler } from "app/utils";

import type { UUID } from "kernel/types";
import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";

export type MoveClipboardBvrT = {|
  targetMoveLists: Array<MoveListT>,
  shareToList: (moveList: MoveListT) => boolean,
  moveToList: (sourceMoveList: MoveListT, moveList: MoveListT) => boolean,
|};

export function useMoveClipboard(
  moveLists: Array<MoveListT>,
  selectedMoves: Array<MoveT>,
  highlightedMoveId: UUID,
  setHighlightedMoveId: UUID => void,
  actInsertMoves: (
    moveIds: Array<UUID>,
    moveList: UUID,
    targetMoveId: UUID
  ) => Array<UUID>,
  actRemoveMoves: (moveIds: Array<UUID>, moveList: UUID) => Array<UUID>
): MoveClipboardBvrT {
  function isTarget(moveList: MoveListT): boolean {
    return selectedMoves
      .map(x => x.id)
      .some(moveId => !moveList.moves.includes(moveId));
  }

  const targetMoveLists: Array<MoveListT> = moveLists.filter(isTarget);
  function shareToList(targetMoveList: MoveListT) {
    if (isTarget(targetMoveList)) {
      const moveIdsInTargetMoveList = actInsertMoves(
        selectedMoves.map(x => x.id),
        targetMoveList.id,
        ""
      );
      moveListsApi
        .saveMoveOrdering(targetMoveList.id, moveIdsInTargetMoveList)
        .catch(createErrorHandler("Could not update the move list"));
      return true;
    }
    return false;
  }

  function moveToList(sourceMoveList: MoveListT, targetMoveList: MoveListT) {
    if (!shareToList(targetMoveList)) {
      return false;
    }

    const selectedMoveIds: Array<UUID> = selectedMoves.map(x => x.id);

    const anchorIdx = selectedMoveIds.includes(highlightedMoveId)
      ? selectedMoveIds.indexOf(highlightedMoveId)
      : selectedMoveIds[0];

    const idsOfMovesWithNewSourceMoveList = selectedMoves
      .filter(x => x.sourceMoveListId == sourceMoveList.id)
      .map(x => x.id);

    moveListsApi
      .updateSourceMoveListId(
        idsOfMovesWithNewSourceMoveList,
        targetMoveList.id
      )
      .catch(createErrorHandler("Could not update move"));

    const newMoveIds = actRemoveMoves(selectedMoveIds, sourceMoveList.id);
    moveListsApi
      .saveMoveOrdering(sourceMoveList.id, newMoveIds)
      .catch(createErrorHandler("Could not update the move list"));

    const newIdx =
      findNeighbourIdx(
        newMoveIds,
        selectedMoveIds,
        anchorIdx,
        selectedMoveIds.length,
        1
      ) || findNeighbourIdx(newMoveIds, selectedMoveIds, anchorIdx, -1, -1);

    if (newIdx) {
      setHighlightedMoveId(newMoveIds[newIdx.result]);
    }
    return true;
  }

  return { targetMoveLists, shareToList, moveToList };
}
