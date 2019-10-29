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
