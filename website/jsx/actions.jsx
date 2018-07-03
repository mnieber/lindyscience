import React from 'react'
import * as fromStore from 'jsx/reducers'
import {toTitleCase} from 'jsx/utils'

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

export function toggleLikeMoveVideoLink(id) {
  return {
    type: 'TOGGLE_LIKE_MOVE_VIDEO_LINK',
    id: id,
  }
}

export function setIOStatus(value) {
  return (dispatch, getState) => {
    const state = getState().faq;

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
