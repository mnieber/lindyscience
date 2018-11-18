// @flow

import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import type { InputSelector } from 'reselect';
import type { UUID } from 'app/types';
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
  ioStatus: string,
};

const statusReducer = function(
  state: StatusState = {
    ioStatus: "ok",
  },
  action
): StatusState
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

export const getIOStatus = (state: ReducerState) => state.status.ioStatus;


///////////////////////////////////////////////////////////////////////
// Profile
///////////////////////////////////////////////////////////////////////

type UserProfileState = {
  username: string,
  recentMoveListId: UUID,
};

const userProfileReducer = function(
  state: UserProfileState = {
    username: "",
    recentMoveListId: ""
  },
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

export const getProfile = (state: ReducerState) => state.userProfile;
export const getLoggedInUserName = (state: ReducerState) => state.userProfile.username;
export const getRecentMoveListId = (state: ReducerState) => state.userProfile.recentMoveListId;


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
