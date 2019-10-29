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

export function actSetFollowedMoveListIds(ids: Array<UUID>) {
  return {
    type: "SET_FOLLOWED_MOVE_LIST_IDS",
    ids,
  };
}
