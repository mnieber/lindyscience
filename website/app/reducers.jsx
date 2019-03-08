// @flow

import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import type { InputSelector } from 'reselect';
import type { UUID, VoteByIdT, UserProfileT } from 'app/types';
import {
  reduceMapToMap,
  getObjectValues,
  isNone,
  querySetListToDict,
  insertIdsIntoList,
} from 'utils/utils'


///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateStatus = (state: ReducerState): StatusState => state.status;
const _stateVotes = (state: ReducerState): VotesState => state.votes;


///////////////////////////////////////////////////////////////////////
// Status
///////////////////////////////////////////////////////////////////////

type StatusState = {
  signedInEmail: string
};

const statusReducer = function(
  state: StatusState = {
    signedInEmail: ""
  },
  action
): StatusState
{
  switch (action.type) {
    case 'SET_SIGNED_IN_EMAIL':
      return {
        ...state,
        signedInEmail: action.username
      }
    default:
      return state
  }
}


export const getSignedInEmail = (state: ReducerState): string => state.status.signedInEmail;

///////////////////////////////////////////////////////////////////////
// Profile
///////////////////////////////////////////////////////////////////////

type UserProfileState = ?UserProfileT;

const userProfileReducer = function(
  state: UserProfileState = null,
  action
): UserProfileState
{
  switch (action.type) {
    case 'SET_USER_PROFILE':
      return {
        ...state,
        ...action.profile
      }
    case 'INSERT_MOVE_LISTS_INTO_PROFILE':
      const acc = insertIdsIntoList(
        action.moveListIds,
        state ? state.moveListIds : [],
        action.targetMoveListId,
      )
      return {
        ...state,
        moveListIds: acc
      }
    default:
      return state
  }
}

export const getUserProfile = (state: ReducerState): UserProfileState => state.userProfile;


///////////////////////////////////////////////////////////////////////
// Votes
///////////////////////////////////////////////////////////////////////

type VotesState = VoteByIdT;

export function votesReducer(
  state: VotesState = {},
  action: any
): VotesState
{
  switch (action.type) {
    case 'SET_VOTES':
      return {
        ...state,
        ...action.votes
      };
    case 'CAST_VOTE':
      return {
        ...state,
        [action.id]: action.vote
      }
    default:
      return state
  }
}

export const getVoteByObjectId: Selector<VoteByIdT> = createSelector(
  [_stateVotes],

  (stateVotes): VoteByIdT => {
    return stateVotes;
  }
);


type ReducerState = {
  status: StatusState,
  userProfile: UserProfileState,
  votes: VotesState,
};

export type Selector<TResult> = InputSelector<ReducerState, void, TResult>;

// $FlowFixMe
export const reducer = combineReducers({
  status: statusReducer,
  userProfile: userProfileReducer,
  votes: votesReducer,
});
