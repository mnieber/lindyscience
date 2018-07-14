import React from 'react'
import * as fromStore from 'jsx/reducers'
import {toTitleCase} from 'jsx/utils/utils'

export function addMoveVideoLinks(moveVideoLinks) {
  return {
    type: 'ADD_MOVE_VIDEO_LINKS',
    moveVideoLinks: moveVideoLinks,
  }
}

export function setMoves(moves) {
  return {
    type: 'SET_MOVES',
    moves: moves,
  }
}

export function setVotes(votes) {
  return {
    type: 'SET_VOTES',
    votes: votes,
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
