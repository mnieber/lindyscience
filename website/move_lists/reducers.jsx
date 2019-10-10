import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { getObjectValues, insertIdsIntoList } from "utils/utils";
import { addTags } from "tags/utils";

import type { MoveListT, MoveListByIdT } from "move_lists/types";
import type { TagT, TagMapT } from "tags/types";

const _stateMoveLists = (state: RootReducerStateT): MoveListsStateT =>
  state.moveLists.moveLists;
const _stateTags = (state: RootReducerStateT): MoveListsStateT =>
  state.moveLists.tags;

///////////////////////////////////////////////////////////////////////
// MoveList
///////////////////////////////////////////////////////////////////////

type MoveListsStateT = MoveListByIdT;

export function moveListsReducer(
  state: MoveListsStateT = {},
  action: any
): MoveListsStateT {
  switch (action.type) {
    case "ADD_MOVE_LISTS":
      return {
        ...state,
        ...action.moveLists,
      };
    case "INSERT_MOVE_IDS_INTO_LIST":
      const acc = insertIdsIntoList(
        action.moveIds,
        state[action.moveListId].moves,
        action.targetMoveId,
        action.isBefore
      );
      return {
        ...state,
        [action.moveListId]: {
          ...state[action.moveListId],
          moves: acc,
        },
      };
    case "REMOVE_MOVE_IDS_FROM_LIST":
      const moves = state[action.moveListId].moves.filter(
        x => !action.moveIds.includes(x)
      );

      return {
        ...state,
        [action.moveListId]: {
          ...state[action.moveListId],
          moves: moves,
        },
      };

    default:
      return state;
  }
}

export function tagsReducer(state: TagMapT = {}, action: any): TagsStateT {
  switch (action.type) {
    case "SET_MOVE_LIST_TAGS":
      return {
        ...state,
        ...action.tags,
      };
    case "ADD_MOVE_LISTS":
      return {
        ...state,
        ...addTags(
          getObjectValues(action.moveLists).map((x: MoveListT) => x.tags),
          state
        ),
      };
    default:
      return state;
  }
}

export const getMoveListTags: Selector<Array<TagT>> = createSelector(
  [_stateTags],

  (stateTags): Array<TagT> => {
    return Object.keys(stateTags);
  }
);

export const getMoveLists: Selector<Array<MoveListT>> = createSelector(
  [_stateMoveLists],

  (stateMoveLists): Array<MoveListT> => {
    return getObjectValues(stateMoveLists);
  }
);
export const getMoveListById = _stateMoveLists;

type MoveListNotFoundStateT = { [string]: boolean };

export function moveListNotFoundReducer(
  state: MoveListNotFoundStateT = {},
  action: any
): TagsStateT {
  switch (action.type) {
    case "MARK_MOVE_LIST_NOT_FOUND":
      return {
        ...state,
        [action.moveListUrl]: true,
      };
    default:
      return state;
  }
}

export const getMoveListNotFound = state => state.moveLists.moveListNotFound;

export type ReducerStateT = {
  moveLists: MoveListsStateT,
  tags: TagsStateT,
  moveListNotFound: MoveListNotFoundStateT,
};

// $FlowFixMe
export const reducer = combineReducers({
  tags: tagsReducer,
  moveLists: moveListsReducer,
  moveListNotFound: moveListNotFoundReducer,
});
