// @flow

import React from "react";
import type { UserProfileT } from "app/types";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actSetUserProfile(profile: UserProfileT) {
  return {
    type: "SET_USER_PROFILE",
    profile,
  };
}

export function actSetSignedInEmail(email: string) {
  return {
    type: "SET_SIGNED_IN_EMAIL",
    email,
  };
}

export function actSetLoadedMoveListUrls(moveListUrls: Array<string>) {
  return {
    type: "SET_LOADED_MOVE_LIST_URLS",
    moveListUrls,
  };
}
