// @flow

import { insertIdsIntoList } from "utils/utils";

import type { RootReducerStateT } from "app/root_reducer";

///////////////////////////////////////////////////////////////////////
// Status
///////////////////////////////////////////////////////////////////////

type StatusStateT = {
  signedInEmail: string,
};

export type ReducerStateT = StatusStateT;

const statusReducer = function(
  state: StatusStateT = {
    signedInEmail: "",
  },
  action: any
): StatusStateT {
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
  state.app.signedInEmail;

export const reducer = statusReducer;
