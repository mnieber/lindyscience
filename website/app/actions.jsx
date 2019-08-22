// @flow

import React from "react";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

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
