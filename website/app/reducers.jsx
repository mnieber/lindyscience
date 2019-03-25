// @flow

import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { insertIdsIntoList } from "utils/utils";

import type { VoteByIdT, UserProfileT } from "app/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateStatus = (state: RootReducerStateT): StatusState =>
  state.app.status;
const _stateVotes = (state: RootReducerStateT): VotesState => state.app.votes;

///////////////////////////////////////////////////////////////////////
// Status
///////////////////////////////////////////////////////////////////////

type StatusState = {
  signedInEmail: string,
};

const statusReducer = function(
  state: StatusState = {
    signedInEmail: "",
  },
  action
): StatusState {
  switch (action.type) {
    case "SET_SIGNED_IN_EMAIL":
      return {
        ...state,
        signedInEmail: action.email,
      };
    default:
      return state;
  }
};

export const getSignedInEmail = (state: RootReducerStateT): string =>
  state.app.status.signedInEmail;

///////////////////////////////////////////////////////////////////////
// Profile
///////////////////////////////////////////////////////////////////////

type UserProfileState = ?UserProfileT;

const userProfileReducer = function(
  state: UserProfileState = null,
  action
): UserProfileState {
  switch (action.type) {
    case "SET_SIGNED_IN_EMAIL":
      return null;
    case "SET_USER_PROFILE":
      return {
        ...state,
        ...action.profile,
      };
    case "INSERT_MOVE_LISTS_INTO_PROFILE":
      const acc = insertIdsIntoList(
        action.moveListIds,
        state ? state.moveListIds : [],
        action.targetMoveListId
      );
      return {
        ...state,
        moveListIds: acc,
      };
    default:
      return state;
  }
};

export const getUserProfile = (state: RootReducerStateT): UserProfileState =>
  state.app.userProfile;

///////////////////////////////////////////////////////////////////////
// Votes
///////////////////////////////////////////////////////////////////////

type VotesState = VoteByIdT;

export function votesReducer(state: VotesState = {}, action: any): VotesState {
  switch (action.type) {
    case "SET_SIGNED_IN_EMAIL":
      return {};
    case "SET_VOTES":
      return {
        ...state,
        ...action.votes,
      };
    case "CAST_VOTE":
      return {
        ...state,
        [action.id]: action.vote,
      };
    default:
      return state;
  }
}

export const getVoteByObjectId: Selector<VoteByIdT> = createSelector(
  [_stateVotes],

  (stateVotes): VoteByIdT => {
    return stateVotes;
  }
);

export type ReducerStateT = {
  status: StatusState,
  userProfile: UserProfileState,
  votes: VotesState,
};

// $FlowFixMe
export const reducer = combineReducers({
  status: statusReducer,
  userProfile: userProfileReducer,
  votes: votesReducer,
});
