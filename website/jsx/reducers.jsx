import { combineReducers } from 'redux'

const moveVideoLinksReducer = function(
  state = [
  ],
  action
)
{
  switch (action.type) {
    case 'SET_MOVE_VIDEO_LINKS':
      return action.moveVideoLinks
    default:
      return state
  }
}

export const linsciReducer = combineReducers({
  moveVideoLinks: moveVideoLinksReducer,
});

export function getMoveVideoLinks(state) {
  return state.moveVideoLinks;
}