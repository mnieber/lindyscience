// @flow

import { insertIdsIntoList } from "utils/utils";

import type { RootReducerStateT } from "app/root_reducer";

///////////////////////////////////////////////////////////////////////
// Status
///////////////////////////////////////////////////////////////////////

type StatusStateT = {
  signedInEmail: string,
  loadedMoveListUrls: Array<string>,
};

export type ReducerStateT = StatusStateT;

const statusReducer = function(
  state: StatusStateT = {
    signedInEmail: "",
    loadedMoveListUrls: [],
  },
  action: any
): StatusStateT {
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
  state.app.signedInEmail;
export const getLoadedMoveListUrls = (
  state: RootReducerStateT
): Array<string> => state.app.loadedMoveListUrls;

export const reducer = statusReducer;
