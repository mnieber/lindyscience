// @flow

import React from 'react'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import { toTitleCase } from 'utils/utils'
import { findMoveBySlugid, makeSlugid } from 'moves/utils'
import type {
  MoveByIdT,
  MoveListByIdT,
  MoveT,
  MoveListT,
  TipT,
  TipByIdT,
  MovePrivateDataByIdT,
  VideoLinkByIdT,
} from 'moves/types'
import type {
  UUID,
  SlugidT,
  TagT,
} from 'app/types'

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actInsertMoveLists(
  moveListIds: Array<UUID>,
  targetMoveListId: UUID,
) {
  const createAction = () => ({
    type: 'INSERT_MOVE_LISTS_INTO_PROFILE',
    moveListIds,
    targetMoveListId,
  });

  return (dispatch: Function, getState: Function) => {
    dispatch(createAction());
    // $FlowFixMe
    const profile: UserProfileT = fromAppStore.getUserProfile(getState().app);
    return profile.moveListIds;
  }
}

export function actAddMoveLists(
  moveLists: MoveListByIdT,
) {
  return {
    type: 'ADD_MOVE_LISTS',
    moveLists,
  }
}

export function actAddMovePrivateDatas(
  movePrivateDatas: MovePrivateDataByIdT
) {
  return {
    type: 'ADD_MOVE_PRIVATE_DATAS',
    movePrivateDatas: movePrivateDatas,
  }
}

export function actAddVideoLinks(videoLinks: VideoLinkByIdT) {
  return {
    type: 'ADD_VIDEO_LINKS',
    videoLinks,
  }
}

export function actAddTips(tips: TipByIdT) {
  return {
    type: 'ADD_TIPS',
    tips
  }
}

function _findNeighbourIdx(filteredMoveIds, allMoveIds, highlightedIdx, endIndex, step) {
  for (
    var moveIdx = highlightedIdx;
    moveIdx != endIndex;
    moveIdx += step
  ) {
    if (filteredMoveIds.includes(allMoveIds[moveIdx])) {
      return {result: moveIdx};
    }
  }
  return undefined;
}

export function actSetMoveListFilter(tags: Array<TagT>) {
  return (dispatch: Function, getState: Function): SlugidT => {
    dispatch({
      type: 'SET_MOVE_LIST_FILTER',
      tags: tags,
    });

    const state = getState();
    const allMoves = fromStore.getMovesInList(state.moves);
    const highlightedMove = findMoveBySlugid(
      allMoves,
      fromStore.getHighlightedMoveSlugid(state.moves)
    );

    if (highlightedMove) {
      const allMoveIds = allMoves.map(x => x.id);
      const filteredMoveIds = fromStore.getFilteredMovesInList(state.moves).map(x => x.id);
      const highlightedIdx = allMoveIds.indexOf(highlightedMove.id);

      const newIdx =
        _findNeighbourIdx(filteredMoveIds, allMoveIds, highlightedIdx, allMoveIds.length, 1) ||
        _findNeighbourIdx(filteredMoveIds, allMoveIds, highlightedIdx, -1, -1);

      if (newIdx) {
        const moveId = allMoveIds[newIdx.result];
        const move = fromStore.getMoveById(state.moves)[moveId];
        const isSlugUnique = allMoves.filter(x => x.slug == move.slug).length == 1;
        return makeSlugid(move.slug, isSlugUnique ? "" : move.id);
      }
    }
    return "";
  }
}

export function actInsertMoves(
  moveIds: Array<UUID>,
  moveListId: UUID,
  targetMoveId: UUID,
) {
  const createAction = () => ({
    type: 'INSERT_MOVES_INTO_LIST',
    moveIds,
    moveListId,
    targetMoveId,
  });

  return (dispatch: Function, getState: Function) => {
    dispatch(createAction());
    // $FlowFixMe
    const moveList = fromStore.getMoveListById(getState().moves)[moveListId];
    return moveList.moves;
  }
}

export function actSetHighlightedMoveBySlug(moveSlug: string, moveId: ?UUID) {
  return {
    type: 'SET_HIGHLIGHTED_MOVE_SLUGID',
    moveSlugid: makeSlugid(moveSlug, moveId),
  };
}

export function actSelectMoveListByUrl(ownerUsername: string, moveListSlug: string) {
  return {
    type: 'SET_SELECTED_MOVE_LIST_URL',
    moveListUrl: ownerUsername + '/' + moveListSlug,
  }
}

export function actAddMoves(moves: Array<MoveT>) {
  return {
    type: 'ADD_MOVES',
    moves,
  }
}
