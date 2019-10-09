// @flow

import { combineReducers, compose } from "redux";
import { createSelector } from "reselect";

import {
  reduceMapToMap,
  getObjectValues,
  querySetListToDict,
  insertIdsIntoList,
} from "utils/utils";
import { findMoveBySlugid } from "screens/utils";
import { getMoveById } from "moves/reducers";
import { getMoveLists } from "move_lists/reducers";

import type { MoveT, MoveByIdT } from "moves/types";
import type { MoveListT, MoveListByIdT } from "move_lists/types";
import type { UUID } from "kernel/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";
import type { FunctionByIdT, MoveSearchResultT } from "screens/types";
import type { PayloadT } from "screens/containers/data_container";

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateSelection = (state: RootReducerStateT): SelectionState =>
  state.screens.selection;
const _stateMoveFilters = (state: RootReducerStateT): MoveFiltersState =>
  state.screens.moveFilters;
const _stateMoveListFilters = (
  state: RootReducerStateT
): MoveListFiltersState => state.screens.moveListFilters;
const _stateMoveContainer = (state: RootReducerStateT): MoveContainerState =>
  state.screens.moveContainer;
const _stateMoveListContainer = (
  state: RootReducerStateT
): MoveListContainerState => state.screens.moveListContainer;

///////////////////////////////////////////////////////////////////////
// Selection
///////////////////////////////////////////////////////////////////////

type SelectionState = {
  highlightedMoveSlugid: string,
  moveListUrl: string,
};

export function selectionReducer(
  state: SelectionState = {
    highlightedMoveSlugid: "",
    moveListUrl: "",
  },
  action: any
): SelectionState {
  switch (action.type) {
    case "SET_HIGHLIGHTED_MOVE_SLUGID":
      return { ...state, highlightedMoveSlugid: action.moveSlugid };
    case "SET_SELECTED_MOVE_LIST_URL":
      return { ...state, moveListUrl: action.moveListUrl };
    default:
      return state;
  }
}

type MoveFiltersState = FunctionByIdT;

export function moveFiltersReducer(
  state: MoveFiltersState = {},
  action: any
): MoveFiltersState {
  switch (action.type) {
    case "SET_MOVE_FILTER":
      return { ...state, [action.filterName]: action.filter };
    default:
      return state;
  }
}

export const getHighlightedMoveSlugid = (state: RootReducerStateT) =>
  state.screens.selection.highlightedMoveSlugid;
export const getSelectedMoveListUrl = (state: RootReducerStateT) =>
  state.screens.selection.moveListUrl;
export const hasLoadedSelectedMoveList = (state: RootReducerStateT) =>
  state.app.loadedMoveListUrls.includes(state.screens.selection.moveListUrl);

type MoveListFiltersState = FunctionByIdT;

export function moveListFiltersReducer(
  state: MoveListFiltersState = {},
  action: any
): MoveListFiltersState {
  switch (action.type) {
    case "SET_MOVE_LIST_FILTER":
      return { ...state, [action.filterName]: action.filter };
    default:
      return state;
  }
}

type MoveContainerState = {
  payload: ?PayloadT<MoveT>,
  isEditing: boolean,
};

export function moveContainerReducer(
  state: MoveContainerState = {
    isEditing: false,
    payload: null,
  },
  action: any
): MoveContainerState {
  switch (action.type) {
    case "SET_MOVE_CONTAINER_PAYLOAD":
      return {
        ...state,
        payload: action.payload,
      };
    case "SET_IS_EDITING_MOVE":
      return {
        ...state,
        isEditing: action.isEditing,
      };
    default:
      return state;
  }
}

type MoveListContainerState = {
  payload: ?PayloadT<MoveListT>,
  isEditing: boolean,
};

export function moveListContainerReducer(
  state: MoveListContainerState = {
    isEditing: false,
    payload: null,
  },
  action: any
): MoveListContainerState {
  switch (action.type) {
    case "SET_MOVE_LIST_CONTAINER_PAYLOAD":
      return {
        ...state,
        payload: action.payload,
      };
    case "SET_IS_EDITING_MOVE_LIST":
      return {
        ...state,
        isEditing: action.isEditing,
      };
    default:
      return state;
  }
}

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
  moveFilters: MoveFiltersState,
  moveListFilters: MoveListFiltersState,
  selection: SelectionState,
  moveContainer: MoveContainerState,
  moveListContainer: MoveListContainerState,
  search: SearchState,
};

// $FlowFixMe
export const reducer = combineReducers({
  moveFilters: moveFiltersReducer,
  moveListFilters: moveListFiltersReducer,
  selection: selectionReducer,
  moveContainer: moveContainerReducer,
  moveListContainer: moveListContainerReducer,
  search: searchReducer,
});

export const getFilteredMoveLists: Selector<Array<MoveListT>> = createSelector(
  [getMoveLists, _stateMoveListFilters],

  (moveLists, stateMoveListFilters): Array<MoveListT> => {
    const filters = getObjectValues(stateMoveListFilters);
    return filters.length ? compose(...filters)(moveLists) : moveLists;
  }
);

export const getSelectedMoveList: Selector<?MoveListT> = createSelector(
  [_stateSelection, getFilteredMoveLists],

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

export const getFilteredMovesInList: Selector<Array<MoveT>> = createSelector(
  [getMovesInList, _stateMoveFilters],

  (moves, stateMoveFilters): Array<MoveT> => {
    const filters = getObjectValues(stateMoveFilters);
    return filters.length ? compose(...filters)(moves) : moves;
  }
);

export const getHighlightedMove: Selector<?MoveT> = createSelector(
  [_stateSelection, getFilteredMovesInList],
  (stateSelection, moves): ?MoveT => {
    return findMoveBySlugid(moves, stateSelection.highlightedMoveSlugid);
  }
);

export const getMoveContainerPayload: Selector<?PayloadT<MoveT>> = createSelector(
  [_stateMoveContainer],
  (stateMoveContainer: MoveContainerState) => {
    return stateMoveContainer.payload;
  }
);

export const getIsEditingMove = (state: RootReducerStateT): boolean =>
  state.screens.moveContainer.isEditing;

export const getMoveListContainerPayload: Selector<?PayloadT<MoveListT>> = createSelector(
  [_stateMoveListContainer],
  (stateMoveListContainer: MoveListContainerState) => {
    return stateMoveListContainer.payload;
  }
);

export const getIsEditingMoveList = (state: RootReducerStateT): boolean =>
  state.screens.moveListContainer.isEditing;

export const getMoveSearchResults = (
  state: RootReducerStateT
): Array<MoveSearchResultT> => state.screens.search.moveSearchResults;
