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
    case 'VOTE_MOVE_VIDEO_LINK':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          voteCount: state[action.id].voteCount + (action.vote - action.prevVote),
        }
      }
    case 'PATCH_MOVE_VIDEO_LINK':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.videoLink,
        }
      }
    case 'REMOVE_EMPTY_MOVE_VIDEO_LINKS':
      const newState = {};
      Object.keys(state).forEach(id => {
        if (state[id].url) {
          newState[id] = state[id];
        }
      })
      return newState;

    default:
      return state
  }
}

const moveTipsReducer = function(
  state = {},
  action
)
{
  switch (action.type) {
    case 'ADD_MOVE_TIPS':
      return {
        ...state,
        ...action.moveTips
      }
    case 'VOTE_MOVE_TIP':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          voteCount: state[action.id].voteCount + (action.vote - action.prevVote),
        }
      }
    case 'PATCH_MOVE_TIP':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.tip,
        }
      }
    case 'REMOVE_EMPTY_MOVE_TIPS':
      const newState = {};
      Object.keys(state).forEach(id => {
        if (state[id].text) {
          newState[id] = state[id];
        }
      })
      return newState;

    default:
      return state
  }
}

const votesReducer = function(
  state = {
    moveVideoLinks: {},
    moveTips: {}
  },
  action
)
{
  switch (action.type) {
    case 'SET_VOTES':
      const votes = {};
      action.votes.moveVideoLinks.forEach(vote => {
        votes[vote.objectId] = vote.value;
      })
      return {...state,
        moveVideoLinks: votes
      };
    case 'VOTE_MOVE_VIDEO_LINK':
      return {
        ...state,
        moveVideoLinks: {...state.moveVideoLinks,
          [action.id]: action.vote
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
  moveTips: moveTipsReducer,
  votes: votesReducer,
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
  ).sort((lhs, rhs) => (rhs.initialVoteCount - lhs.initialVoteCount));
}

export function getMoveVideoLinkById(state, id) {
  return state.moveVideoLinks[id];
}

export function getMoveVideoLinkVoteById(state, id) {
  const result = state.votes.moveVideoLinks[id];
  return result ? result : 0;
}

export function getTipsByMoveId(state, moveId) {
  return Object.values(state.moveTips).filter(
    x => x.move == moveId
  ).sort((lhs, rhs) => (rhs.initialVoteCount - lhs.initialVoteCount));
}

export function getMoveTipById(state, id) {
  return state.moveTips[id];
}

export function getMoveTipVoteById(state, id) {
  const result = state.votes.moveTips[id];
  return result ? result : 0;
}

export const getIOStatus = (state) => state.status.ioStatus;
