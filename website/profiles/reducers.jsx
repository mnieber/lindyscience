// @flow

import type { RootReducerStateT } from "app/root_reducer";
import type { UserProfileT } from "profiles/types";

///////////////////////////////////////////////////////////////////////
// Profile
///////////////////////////////////////////////////////////////////////

type UserProfileState = ?UserProfileT;

export type ReducerStateT = UserProfileState;

const userProfileReducer = function(
  state: UserProfileState = null,
  action: any
): UserProfileState {
  switch (action.type) {
    case "SET_SIGNED_IN_EMAIL":
      return null;
    case "SET_USER_PROFILE":
      return action.profile
        ? {
            ...action.profile,
          }
        : null;
    case "SET_FOLLOWED_MOVE_LIST_IDS":
      return {
        ...state,
        moveListIds: action.ids,
      };
    default:
      return state;
  }
};

export const getUserProfile = (state: RootReducerStateT): UserProfileState =>
  state.profile;

export const reducer = userProfileReducer;
