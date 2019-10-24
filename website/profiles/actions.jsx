// @flow

import React from "react";
import type { UserProfileT } from "profiles/types";
import type { UUID } from "kernel/types";
import * as fromStore from "profiles/reducers";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actSetUserProfile(profile: ?UserProfileT) {
  return {
    type: "SET_USER_PROFILE",
    profile,
  };
}

export function actInsertMoveListIds(
  moveListIds: Array<UUID>,
  targetMoveListId: UUID,
  isBefore: boolean
) {
  const createAction = () => ({
    type: "INSERT_MOVE_LISTS_INTO_PROFILE",
    moveListIds,
    targetMoveListId,
    isBefore,
  });

  return (dispatch: Function, getState: Function) => {
    dispatch(createAction());
    const profile: UserProfileT = (fromStore.getUserProfile(getState()): any);
    return profile.moveListIds;
  };
}

export function actSetFollowedMoveListIds(ids: Array<UUID>) {
  return {
    type: "SET_FOLLOWED_MOVE_LIST_IDS",
    ids,
  };
}

export function actRemoveMoveListIds(moveListIds: Array<UUID>) {
  const createAction = () => ({
    type: "REMOVE_MOVE_LISTS_FROM_PROFILE",
    moveListIds,
  });

  return (dispatch: Function, getState: Function) => {
    dispatch(createAction());
    const profile: UserProfileT = (fromStore.getUserProfile(getState()): any);
    return profile.moveListIds;
  };
}
