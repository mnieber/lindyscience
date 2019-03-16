// @flow

import * as React from "react";

import * as api from "moves/api";

import { findNeighbourIdx } from "moves/utils";
import { createErrorHandler } from "app/utils";

import type { UUID } from "app/types";
import type { MoveListT } from "moves/types";

export type MoveClipboardBvrT = {|
  targetMoveLists: Array<MoveListT>,
  shareToList: (moveList: MoveListT) => boolean,
  moveToList: (sourceMoveList: MoveListT, moveList: MoveListT) => boolean,
|};

export function useMoveClipboard(
  moveLists: Array<MoveListT>,
  selectedMoveIds: Array<UUID>,
  highlightedMoveId: UUID,
  setHighlightedMoveId: UUID => void,
  actInsertMoves: (
    moveIds: Array<UUID>,
    moveList: UUID,
    targetMoveId: UUID
  ) => Array<UUID>,
  actRemoveMoves: (moveIds: Array<UUID>, moveList: UUID) => Array<UUID>
) {
  function isTarget(moveList: MoveListT): boolean {
    return selectedMoveIds.some(moveId => !moveList.moves.includes(moveId));
  }

  const targetMoveLists: Array<MoveListT> = moveLists.filter(isTarget);

  function shareToList(targetMoveList: MoveListT) {
    if (isTarget(targetMoveList)) {
      const moveIdsInTargetMoveList = actInsertMoves(
        selectedMoveIds,
        targetMoveList.id,
        ""
      );
      api
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

    const anchorIdx = selectedMoveIds.includes(highlightedMoveId)
      ? selectedMoveIds.indexOf(highlightedMoveId)
      : selectedMoveIds[0];

    const newMoveIds = actRemoveMoves(selectedMoveIds, sourceMoveList.id);
    api
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
