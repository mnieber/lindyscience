import React from 'react'
import * as fromStore from 'jsx/reducers'

export function setMoveVideoLinks(moveVideoLinks) {
  return {
    type: 'SET_MOVE_VIDEO_LINKS',
    moveVideoLinks: moveVideoLinks,
  }
}

export function toggleLikeMoveVideoLink(id) {
  return {
    type: 'TOGGLE_LIKE_MOVE_VIDEO_LINK',
    id: id,
  }
}
