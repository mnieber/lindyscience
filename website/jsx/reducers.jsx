import { combineReducers } from 'redux'

const movesReducer = function(
  state = {},
  action
)
{
  switch (action.type) {
    case 'ADD_MOVES':
      return {...state,
        ...action.moves
    }
    default:
      return state
  }
}

const movePrivateDatasReducer = function(
  state = {},
  action
)
{
  switch (action.type) {
    case 'ADD_MOVE_PRIVATE_DATAS':
      return {...state,
        ...action.movePrivateDatas
    }
    default:
      return state
  }
}

const _tagsToDict = tags => {
  const result = {};
  tags.forEach(tag => {result[tag] = true});
  return result;
}

const tagsReducer = function(
  state = {
    moves: {}
  },
  action
)
{
  switch (action.type) {
    case 'ADD_MOVE_TAGS':
      return {
        ...state,
        moves: {...state.moves, ..._tagsToDict(action.tags)}
      }
    case 'ADD_MOVES':
      const newTags = {};
      Object.values(action.moves).forEach(move => {
        move.tags
          .split(',')
          .map(x => x.trim())
          .forEach(tag => newTags[tag] = true);
      })
      return {
        ...state,
        moves: {...state.moves, ...newTags}
      }
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
  movePrivateDatas: movePrivateDatasReducer,
  moveVideoLinks: moveVideoLinksReducer,
  moveTips: moveTipsReducer,
  votes: votesReducer,
  tags: tagsReducer,
  status: statusReducer,
});

function _addPrivateData(state, move) {
  if (!move) {
    return move;
  }
  return {...move,
    privateData: getMovePrivateDataByMoveId(state, move.id)
  };
}

export function getMoves(state) {
  return Object.values(state.moves).map(x => _addPrivateData(state, x));
}

export function getMoveTags(state) {
  return Object.keys(state.tags.moves);
}

export function getMoveBySlug(state, slug) {
  const move = getMoves(state).filter(x => (x.slug == slug))[0];
  return _addPrivateData(state, move);
}

export function getMoveById(state, id) {
  return _addPrivateData(state, state.moves[id]);
}

export function getMovePrivateDataByMoveId(state, move_id) {
  return state.movePrivateDatas[move_id] || {};
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
