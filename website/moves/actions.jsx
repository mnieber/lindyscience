// @flow
import React from 'react'
import * as fromStore from 'moves/reducers'
import {toTitleCase} from 'utils/utils'
import type {
  MoveByIdT,
  MoveListByIdT,
  MoveT,
  TagT,
  TipT,
  TipByIdT,
  MovePrivateDataByIdT,
  VoteT,
  VoteByIdT,
  VideoLinkByIdT,
} from 'moves/types'
import type {
  UUID,
} from 'app/types'

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actAddMoveLists(
  moveLists: MoveListByIdT,
  moves: MoveByIdT,
) {
  return {
    type: 'ADD_MOVE_LISTS',
    moveLists,
    moves,
  }
}

export function actSetVotes(votes: VoteByIdT) {
  return {
    type: 'SET_VOTES',
    votes: votes,
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

export function actCastVote(id: UUID, vote: VoteT) {
  return (dispatch: Function, getState: Function) => {
    const prevVote = fromStore.getVoteByObjectId(getState().moves)[id];

    dispatch({
      type: 'CAST_VOTE',
      id: id,
      vote: vote,
      prevVote: prevVote,
    });
  }
}

export function actAddTips(tips: TipByIdT) {
  return {
    type: 'ADD_TIPS',
    tips
  }
}

export function actSetHighlightedMoveId(moveId: UUID) {
  return {
    type: 'SET_HIGHLIGHTED_MOVE_ID',
    moveId: moveId
  }
}

export function actSetMoveListFilter(
  tags: Array<TagT>,
  restrictHighlightedMove: boolean
) {
  return (dispatch: Function, getState: Function) => {
    dispatch({
      type: 'SET_MOVE_LIST_FILTER',
      tags: tags,
    });

    if (restrictHighlightedMove) {
      const state = getState();
      const allMoveIds = fromStore.getMoves(state.moves).map(x => x.id);
      const filteredMoveIds = fromStore.getFilteredMoves(state.moves).map(x => x.id);
      for (
        var moveIdx = allMoveIds.indexOf(fromStore.getHighlightedMoveId(state.moves));
        moveIdx < allMoveIds.length;
        moveIdx += 1
      ) {
        if (filteredMoveIds.includes(allMoveIds[moveIdx])) {
          dispatch(actSetHighlightedMoveId(allMoveIds[moveIdx]));
          break;
        }
      }
    }
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
    return fromStore.getMovesInList(getState().moves).map(x => x.id);
  }
}

export function actSelectMoveListById(moveListId: UUID) {
  return (dispatch: Function, getState: Function) => {
    dispatch ({
      type: 'SELECT_MOVE_LIST',
      moveListId,
    });

    const state = getState();
    const moveList = fromStore.getMoveLists(state.moves)
      .find(x => x.id == moveListId)
    const moveListMoves = (moveList && moveList.moves)
      ? moveList.moves
      : [];

    if (!moveListMoves.includes(
      fromStore.getHighlightedMoveId(state.moves)
    )) {
      dispatch(actSetHighlightedMoveId(""));
    }
  }
}

export function actUpdateMoves(moves: Array<MoveT>) {
  return {
    type: 'UPDATE_MOVES',
    moves,
  }
}
