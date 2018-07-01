import React from 'react'
import * as fromStore from 'jsx/reducers'

export function setMoveVideoLinks(moveVideoLinks) {
  return {
    type: 'SET_MOVE_VIDEO_LINKS',
    moveVideoLinks: moveVideoLinks,
  }
}
