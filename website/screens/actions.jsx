// @flow

import React from "react";
import * as fromStore from "screens/reducers";
import * as fromMoveListsStore from "move_lists/reducers";
import { makeSlugid, findNeighbourIdx } from "screens/utils";
import { getPreview } from "screens/utils";

import type { MoveListByIdT, MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import type { UUID, SlugidT } from "kernel/types";
import type { PayloadT } from "screens/containers/data_container";
import type { MoveSearchResultT } from "screens/types";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

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
    const allMoveLists = fromMoveListsStore.getMoveLists(getState());

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

export function actSetMoveContainerPayload(payload: ?PayloadT<MoveT>) {
  const createAction = () => ({
    type: "SET_MOVE_CONTAINER_PAYLOAD",
    payload,
  });

  return (dispatch: Function, getState: Function) => {
    function _filter(moves: Array<MoveT>) {
      return getPreview<MoveT>(moves, payload);
    }
    dispatch(actSetMoveFilter("insertMovePreview", _filter));
    dispatch(createAction());
  };
}

export function actSetMoveListContainerPayload(payload: ?PayloadT<MoveListT>) {
  const createAction = () => ({
    type: "SET_MOVE_LIST_CONTAINER_PAYLOAD",
    payload,
  });

  return (dispatch: Function, getState: Function) => {
    function _filter(moveLists: Array<MoveListT>) {
      return getPreview<MoveListT>(moveLists, payload);
    }
    dispatch(actSetMoveListFilter("insertMoveListPreview", _filter));
    dispatch(createAction());
  };
}

export function actSetIsEditingMove(isEditing: boolean) {
  return {
    type: "SET_IS_EDITING_MOVE",
    isEditing,
  };
}

export function actSetIsEditingMoveList(isEditing: boolean) {
  return {
    type: "SET_IS_EDITING_MOVE_LIST",
    isEditing,
  };
}

export function actSetMoveSearchResults(
  moveSearchResults: Array<MoveSearchResultT>
) {
  return {
    type: "SET_MOVE_SEARCH_RESULTS",
    moveSearchResults,
  };
}
