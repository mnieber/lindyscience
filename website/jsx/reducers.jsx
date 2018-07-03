import { combineReducers } from 'redux'

const movesReducer = function(
  state = {},
  action
)
{
  switch (action.type) {
    case 'SET_MOVES':
      return action.moves
    default:
      return state
  }
}

const moveVideoLinksReducer = function(
  state = {},
  action
)
{
  switch (action.type) {
    case 'ADD_MOVE_VIDEO_LINKS':
      return {
        ...state,
        ...action.moveVideoLinks
      }
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

const statusReducer = function(
  state = {
    ioStatus: "ok",
    showApprovedQuestions: false,
  },
  action
)
{
  switch (action.type) {
    case 'SET_IO_STATUS':
      return { ...state,
        ioStatus: action.value
      }
    default:
      return state
  }
}

export const linsciReducer = combineReducers({
  moves: movesReducer,
  moveVideoLinks: moveVideoLinksReducer,
  status: statusReducer,
});

export function getMoves(state) {
  return Object.values(state.moves);
}

export function getMoveByName(state, name) {
  const move = getMoves(state).filter(
    x => x.name.toLowerCase() == name.toLowerCase()
  )[0];
  return move;
}

export function getVideoLinksByMoveId(state, moveId) {
  return Object.values(state.moveVideoLinks).filter(
    x => x.move == moveId
  );
}

export function getMoveVideoLinkById(state, id) {
  return state.moveVideoLinks[id];
}

export const getIOStatus = (state) => state.status.ioStatus;
