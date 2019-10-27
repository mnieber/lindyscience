// @flow

import { combineReducers } from "redux";
import { createSelector } from "reselect";

import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import type { MoveSearchResultT } from "screens/types";
import { getMoveById } from "moves/reducers";
import { getMoveLists } from "move_lists/reducers";
import type { RootReducerStateT, Selector } from "app/root_reducer";

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateSelection = (state: RootReducerStateT): SelectionState =>
  state.screens.selection;

///////////////////////////////////////////////////////////////////////
// Selection
///////////////////////////////////////////////////////////////////////

type SelectionState = {
  moveListUrl: string,
  locationMemo: string,
};

export function selectionReducer(
  state: SelectionState = {
    moveListUrl: "",
    locationMemo: "",
  },
  action: any
): SelectionState {
  switch (action.type) {
    case "SET_LOCATION_MEMO":
      return { ...state, locationMemo: action.pathname };
    default:
      return state;
  }
}

export const getLocationMemo = (state: RootReducerStateT) =>
  state.screens.selection.locationMemo;

type SearchState = {
  moveSearchResults: Array<MoveSearchResultT>,
};

export function searchReducer(
  state: SearchState = {
    moveSearchResults: [],
  },
  action: any
): SearchState {
  switch (action.type) {
    case "SET_MOVE_SEARCH_RESULTS":
      return {
        ...state,
        moveSearchResults: action.moveSearchResults,
      };
    default:
      return state;
  }
}

export type ReducerStateT = {
  selection: SelectionState,
  search: SearchState,
};

// $FlowFixMe
export const reducer = combineReducers({
  selection: selectionReducer,
  search: searchReducer,
});

export const getSelectedMoveList: Selector<?MoveListT> = createSelector(
  [_stateSelection, getMoveLists],

  (stateSelection, moveLists): ?MoveListT => {
    const [ownerUsername, slug] = stateSelection.moveListUrl.split("/");
    const isMatch = x => x.ownerUsername == ownerUsername && x.slug == slug;
    return moveLists.find(isMatch);
  }
);

export const getMovesInList: Selector<Array<MoveT>> = createSelector(
  [getMoveById, getSelectedMoveList],

  (moveById, moveList): Array<MoveT> => {
    return moveList
      ? (moveList.moves || []).map(moveId => moveById[moveId]).filter(x => !!x)
      : [];
  }
);

export const getMoveSearchResults = (
  state: RootReducerStateT
): Array<MoveSearchResultT> => state.screens.search.moveSearchResults;
