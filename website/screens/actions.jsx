// @flow

import { navigate } from "@reach/router";

import * as fromStore from "screens/reducers";
import type { MoveSearchResultT } from "screens/types";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actSetSelectedMoveListUrl(
  ownerUsername: string,
  moveListSlug: string
) {
  return {
    type: "SET_SELECTED_MOVE_LIST_URL",
    moveListUrl: ownerUsername + "/" + moveListSlug,
  };
}

export function actSetMoveSearchResults(
  moveSearchResults: Array<MoveSearchResultT>
) {
  return {
    type: "SET_MOVE_SEARCH_RESULTS",
    moveSearchResults,
  };
}

export function actStoreLocationMemo(pathname: string) {
  return {
    type: "SET_LOCATION_MEMO",
    pathname,
  };
}

export function actRestoreLocationMemo() {
  return (dispatch: Function, getState: Function) => {
    navigate(fromStore.getLocationMemo(getState()));
  };
}
