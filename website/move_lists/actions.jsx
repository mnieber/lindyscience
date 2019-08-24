// @flow

import React from "react";
import * as fromStore from "move_lists/reducers";

import type { MoveListByIdT } from "move_lists/types";
import type { UUID } from "kernel/types";

export function actAddMoveLists(moveLists: MoveListByIdT) {
  return {
    type: "ADD_MOVE_LISTS",
    moveLists,
  };
}

export function actInsertMoves(
  moveIds: Array<UUID>,
  moveListId: UUID,
  targetMoveId: UUID
) {
  const createAction = () => ({
    type: "INSERT_MOVES_INTO_LIST",
    moveIds,
    moveListId,
    targetMoveId,
  });

  return (dispatch: Function, getState: Function) => {
    dispatch(createAction());
    // $FlowFixMe
    const moveList = fromStore.getMoveListById(getState())[moveListId];
    return moveList.moves;
  };
}

export function actRemoveMoves(moveIds: Array<UUID>, moveListId: UUID) {
  const createAction = () => ({
    type: "REMOVE_MOVES_FROM_LIST",
    moveIds,
    moveListId,
  });

  return (dispatch: Function, getState: Function) => {
    dispatch(createAction());
    // $FlowFixMe
    const moveList = fromStore.getMoveListById(getState())[moveListId];
    return moveList.moves;
  };
}
