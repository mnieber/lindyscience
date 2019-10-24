// @flow

import * as fromStore from "screens/reducers";
import type { MoveSearchResultT } from "screens/types";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

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

export function actRestoreLocationMemo(history: any) {
  return (dispatch: Function, getState: Function) => {
    history.push(fromStore.getLocationMemo(getState()));
  };
}
