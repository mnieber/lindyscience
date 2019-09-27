// @flow

import React from "react";
import * as fromStore from "move_lists/reducers";

import type { MoveListByIdT } from "move_lists/types";
import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";

export function actAddMoveLists(moveLists: MoveListByIdT) {
  return {
    type: "ADD_MOVE_LISTS",
    moveLists,
  };
}

export function actInsertMoveIds(
  moveIds: Array<UUID>,
  moveListId: UUID,
  targetMoveId: UUID
) {
  const createAction = () => ({
    type: "INSERT_MOVE_IDS_INTO_LIST",
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

export function actRemoveMoveIds(moveIds: Array<UUID>, moveListId: UUID) {
  const createAction = () => ({
    type: "REMOVE_MOVE_IDS_FROM_LIST",
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

export function actSetMoveListTags(tags: Array<TagT>) {
  return {
    type: "SET_MOVE_LIST_TAGS",
    tags,
  };
}
