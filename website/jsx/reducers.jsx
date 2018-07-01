import { combineReducers } from 'redux'

const moveVideoLinksReducer = function(
  state = {},
  action
)
{
  switch (action.type) {
    case 'SET_MOVE_VIDEO_LINKS':
      return action.moveVideoLinks
    case 'TOGGLE_LIKE_MOVE_VIDEO_LINK':
      const wasLiked = state[action.id].isLikedByCurrentUser;
      const nrVotes = state[action.id].nrVotes;
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          isLikedByCurrentUser: !wasLiked,
          nrVotes: nrVotes + (wasLiked ? -1 : 1),
        }
      }
    default:
      return state
  }
}

export const linsciReducer = combineReducers({
  moveVideoLinks: moveVideoLinksReducer,
});

export function getMoveVideoLinks(state) {
  return Object.values(state.moveVideoLinks);
}

export function getMoveVideoLink(state, id) {
  return state.moveVideoLinks[id];
}
