// @flow

import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import type { InputSelector } from 'reselect';
import type { UUID, UserProfileT } from 'app/types';
import {
  reduceMapToMap,
  getObjectValues,
  isNone,
  querySetListToDict,
} from 'utils/utils'


///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateStatus = (state: ReducerState): StatusState => state.status;


///////////////////////////////////////////////////////////////////////
// Status
///////////////////////////////////////////////////////////////////////

type StatusState = {
};

const statusReducer = function(
  state: StatusState = {
  },
  action
): StatusState
{
  switch (action.type) {
    default:
      return state
  }
}


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
    default:
      return state
  }
}

export const getUserProfile = (state: ReducerState): UserProfileState => state.userProfile;


type ReducerState = {
  status: StatusState,
  userProfile: UserProfileState,
};

export type Selector<TResult> = InputSelector<ReducerState, void, TResult>;

// $FlowFixMe
export const reducer = combineReducers({
  status: statusReducer,
  userProfile: userProfileReducer,
});
