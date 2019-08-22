// @flow

import React from "react";
import type { UUID, UserProfileT } from "profiles/types";
import * as fromStore from "profiles/reducers";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actSetUserProfile(profile: UserProfileT) {
  return {
    type: "SET_USER_PROFILE",
    profile,
  };
}

export function actInsertMoveListIds(
  moveListIds: Array<UUID>,
  targetMoveListId: UUID
) {
  const createAction = () => ({
    type: "INSERT_MOVE_LISTS_INTO_PROFILE",
    moveListIds,
    targetMoveListId,
  });

  return (dispatch: Function, getState: Function) => {
    dispatch(createAction());
    // $FlowFixMe
    const profile: UserProfileT = fromStore.getUserProfile(getState());
    return profile.moveListIds;
  };
}

export function actRemoveMoveListIds(moveListIds: Array<UUID>) {
  const createAction = () => ({
    type: "REMOVE_MOVE_LISTS_FROM_PROFILE",
    moveListIds,
  });

  return (dispatch: Function, getState: Function) => {
    dispatch(createAction());
    // $FlowFixMe
    const profile: UserProfileT = fromStore.getUserProfile(getState());
    return profile.moveListIds;
  };
}
