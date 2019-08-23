// @flow

import type { RootReducerStateT } from "app/root_reducer";
import { insertIdsIntoList } from "utils/utils";

import type { UserProfileT } from "profiles/types";
import type { UUID } from "kernel/types";

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
  state.profile;

export const reducer = userProfileReducer;
