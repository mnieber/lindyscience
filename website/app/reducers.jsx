// @flow

import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { insertIdsIntoList } from "utils/utils";

import type { UserProfileT } from "app/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateStatus = (state: RootReducerStateT): StatusState =>
  state.app.status;

///////////////////////////////////////////////////////////////////////
// Status
///////////////////////////////////////////////////////////////////////

type StatusState = {
  signedInEmail: string,
  loadedMoveListUrls: Array<string>,
};

const statusReducer = function(
  state: StatusState = {
    signedInEmail: "",
    loadedMoveListUrls: [],
  },
  action
): StatusState {
  switch (action.type) {
    case "SET_SIGNED_IN_EMAIL":
      return {
        ...state,
        signedInEmail: action.email,
      };
    case "SET_LOADED_MOVE_LIST_URLS":
      return {
        ...state,
        loadedMoveListUrls: [...action.moveListUrls],
      };
    default:
      return state;
  }
};

export const getSignedInEmail = (state: RootReducerStateT): string =>
  state.app.status.signedInEmail;
export const getLoadedMoveListUrls = (
  state: RootReducerStateT
): Array<string> => state.app.status.loadedMoveListUrls;

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
    case "REMOVE_MOVE_LISTS_FROM_PROFILE":
      return {
        ...state,
        moveListIds: (state ? state.moveListIds : []).filter(
          x => !action.moveListIds.includes(x)
        ),
      };
    default:
      return state;
  }
};

export const getUserProfile = (state: RootReducerStateT): UserProfileState =>
  state.app.userProfile;

export type ReducerStateT = {
  status: StatusState,
  userProfile: UserProfileState,
};

// $FlowFixMe
export const reducer = combineReducers({
  status: statusReducer,
  userProfile: userProfileReducer,
});
