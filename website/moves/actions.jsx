// @flow

import React from "react";
import * as fromStore from "moves/reducers";
import * as fromAppStore from "app/reducers";
import { toTitleCase } from "utils/utils";
import { findMoveBySlugid, makeSlugid, findNeighbourIdx } from "moves/utils";
import type {
  MoveByIdT,
  MoveListByIdT,
  MoveT,
  MoveListT,
  TipT,
  TipByIdT,
  MovePrivateDataByIdT,
  VideoLinkByIdT,
} from "moves/types";
import type { UUID, SlugidT, TagT } from "app/types";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actInsertMoveLists(
  moveListIds: Array<UUID>,
  targetMoveListId: UUID
) {
  const createAction = () => ({
    type: "INSERT_MOVE_LISTS_INTO_PROFILE",
    moveListIds,
    targetMoveListId,
  });

  return (dispatch: Function, getState: Function) => {
    dispatch(createAction());
    // $FlowFixMe
    const profile: UserProfileT = fromAppStore.getUserProfile(getState());
    return profile.moveListIds;
  };
}

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

export function actAddVideoLinks(videoLinks: VideoLinkByIdT) {
  return {
    type: "ADD_VIDEO_LINKS",
    videoLinks,
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

export function actSetMovePayload(moves: Array<MoveT>) {
  return {
    type: "SET_MOVE_PAYLOAD",
    moves,
  };
}

export function actSetMoveListPayload(moveLists: Array<MoveListT>) {
  return {
    type: "SET_MOVE_LIST_PAYLOAD",
    moveLists,
  };
}
