// @flow

import React from "react";
import * as fromStore from "screens/reducers";
import { makeSlugid, findNeighbourIdx } from "screens/utils";
import type {
  MoveListByIdT,
  MoveListT,
  TipByIdT,
  MovePrivateDataByIdT,
} from "screens/types";
import type { MoveT } from "moves/types";
import type { UUID, SlugidT } from "kernel/types";
import type { TagT } from "profiles/types";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actAddMoveLists(moveLists: MoveListByIdT) {
  return {
    type: "ADD_MOVE_LISTS",
    moveLists,
  };
}

export function actAddMovePrivateDatas(movePrivateDatas: MovePrivateDataByIdT) {
  return {
    type: "ADD_MOVE_PRIVATE_DATAS",
    movePrivateDatas: movePrivateDatas,
  };
}

export function actSetMovePrivateDatas(movePrivateDatas: MovePrivateDataByIdT) {
  return {
    type: "SET_MOVE_PRIVATE_DATAS",
    movePrivateDatas: movePrivateDatas,
  };
}

export function actAddTips(tips: TipByIdT) {
  return {
    type: "ADD_TIPS",
    tips,
  };
}

export function actRemoveTips(tips: Array<UUID>) {
  return {
    type: "REMOVE_TIPS",
    tips,
  };
}

export function actSetMoveFilter(name: string, filter: Function) {
  return (dispatch: Function, getState: Function): SlugidT => {
    const highlightedMove = fromStore.getHighlightedMove(getState());
    const allMoves = fromStore.getMovesInList(getState());

    dispatch({
      type: "SET_MOVE_FILTER",
      filterName: name,
      filter,
    });

    if (highlightedMove) {
      const state = getState();
      const allMoveIds = allMoves.map(x => x.id);
      const highlightedIdx = allMoveIds.indexOf(highlightedMove.id);
      const filteredMoveIds = fromStore
        .getFilteredMovesInList(state)
        .map(x => x.id);

      const newIdx =
        findNeighbourIdx(
          filteredMoveIds,
          allMoveIds,
          highlightedIdx,
          allMoveIds.length,
          1
        ) ||
        findNeighbourIdx(filteredMoveIds, allMoveIds, highlightedIdx, -1, -1);

      if (newIdx) {
        return allMoveIds[newIdx.result];
      }
    }
    return "";
  };
}

export function actSetMoveListFilter(name: string, filter: Function) {
  return (dispatch: Function, getState: Function): SlugidT => {
    const selectedMoveList = fromStore.getSelectedMoveList(getState());
    const allMoveLists = fromStore.getMoveLists(getState());

    dispatch({
      type: "SET_MOVE_LIST_FILTER",
      filterName: name,
      filter,
    });

    if (selectedMoveList) {
      const state = getState();
      const allMoveListIds = allMoveLists.map(x => x.id);
      const selectedIdx = allMoveListIds.indexOf(selectedMoveList.id);
      const filteredMoveListIds = fromStore
        .getFilteredMoveLists(state)
        .map(x => x.id);

      const newIdx =
        findNeighbourIdx(
          filteredMoveListIds,
          allMoveListIds,
          selectedIdx,
          allMoveListIds.length,
          1
        ) ||
        findNeighbourIdx(
          filteredMoveListIds,
          allMoveListIds,
          selectedIdx,
          -1,
          -1
        );

      if (newIdx) {
        return allMoveListIds[newIdx.result];
      }
    }
    return "";
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

export function actSetHighlightedMoveBySlug(moveSlug: string, moveId: ?UUID) {
  return {
    type: "SET_HIGHLIGHTED_MOVE_SLUGID",
    moveSlugid: makeSlugid(moveSlug, moveId),
  };
}

export function actSetSelectedMoveListUrl(
  ownerUsername: string,
  moveListSlug: string
) {
  return {
    type: "SET_SELECTED_MOVE_LIST_URL",
    moveListUrl: ownerUsername + "/" + moveListSlug,
  };
}

export function actAddMoves(moves: Array<MoveT>) {
  return {
    type: "ADD_MOVES",
    moves,
  };
}

export function actSetMoveTags(tags: Array<TagT>) {
  return {
    type: "SET_MOVE_TAGS",
    tags,
  };
}

export function actSetMoveListTags(tags: Array<TagT>) {
  return {
    type: "SET_MOVE_LIST_TAGS",
    tags,
  };
}
