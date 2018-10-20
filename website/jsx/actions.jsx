import React from 'react'
import * as fromStore from 'jsx/reducers'
import {toTitleCase} from 'jsx/utils/utils'

export function addMoves(moves) {
  return {
    type: 'ADD_MOVES',
    moves: moves,
  }
}

export function addMoveTags(tags) {
  return {
    type: 'ADD_MOVE_TAGS',
    tags: tags,
  }
}

export function setVotes(votes) {
  return {
    type: 'SET_VOTES',
    votes: votes,
  }
}

export function setMovePrivateDatas(movePrivateDatas) {
  return {
    type: 'SET_MOVE_PRIVATE_DATAS',
    movePrivateDatas: movePrivateDatas,
  }
}

export function addMoveVideoLinks(moveVideoLinks) {
  return {
    type: 'ADD_MOVE_VIDEO_LINKS',
    moveVideoLinks: moveVideoLinks,
  }
}

export function patchMoveVideoLink(id, videoLink) {
  return {
    type: 'PATCH_MOVE_VIDEO_LINK',
    id: id,
    videoLink: videoLink,
  }
}

export function removeEmptyMoveVideoLinks() {
  return {
    type: 'REMOVE_EMPTY_MOVE_VIDEO_LINKS',
  }
}

export function voteMoveVideoLink(id, vote) {
  return (dispatch, getState) => {
    const state = getState();
    const prevVote = fromStore.getMoveVideoLinkVoteById(state.linsci, id);

    dispatch({
      type: 'VOTE_MOVE_VIDEO_LINK',
      id: id,
      vote: vote,
      prevVote: prevVote,
    });
  }
}

export function addMoveTips(moveTips) {
  return {
    type: 'ADD_MOVE_TIPS',
    moveTips: moveTips,
  }
}

export function patchMoveTip(id, tip) {
  return {
    type: 'PATCH_MOVE_TIP',
    id: id,
    tip: tip,
  }
}

export function removeEmptyMoveTips() {
  return {
    type: 'REMOVE_EMPTY_MOVE_TIPS',
  }
}

export function setSelectedMoveId(moveId) {
  return {
    type: 'SET_SELECTED_MOVE_ID',
    moveId: moveId
  }
}

export function voteMoveTip(id, vote) {
  return (dispatch, getState) => {
    const state = getState();
    const prevVote = fromStore.getMoveTipVoteById(state.linsci, id);

    dispatch({
      type: 'VOTE_MOVE_TIP',
      id: id,
      vote: vote,
      prevVote: prevVote,
    });
  }
}

export function setIOStatus(value) {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_IO_STATUS',
      value: "before" + toTitleCase(value),
    });

    dispatch({
      type: 'SET_IO_STATUS',
      value: value,
    });
  }
}

/// Add an action above
