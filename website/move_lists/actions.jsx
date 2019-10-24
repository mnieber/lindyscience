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
  targetMoveId: UUID,
  isBefore: boolean
) {
  const createAction = () => ({
    type: "INSERT_MOVE_IDS_INTO_LIST",
    moveIds,
    moveListId,
    targetMoveId,
    isBefore,
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

export function actSetMoveIds(moveIds: Array<UUID>, moveListId: UUID) {
  return {
    type: "SET_MOVE_IDS_FOR_LIST",
    moveIds,
    moveListId,
  };
}

export function actSetMoveListTags(tags: Array<TagT>) {
  return {
    type: "SET_MOVE_LIST_TAGS",
    tags,
  };
}

export function actMarkMoveListNotFound(moveListUrl: string) {
  return {
    type: "MARK_MOVE_LIST_NOT_FOUND",
    moveListUrl,
  };
}
