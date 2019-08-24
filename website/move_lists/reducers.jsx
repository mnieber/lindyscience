import { getObjectValues, insertIdsIntoList } from "utils/utils";

import type { MoveListT, MoveListByIdT } from "move_lists/types";

const _stateMoveLists = (state: RootReducerStateT): MoveListsStateT =>
  state.screens.moveLists;

///////////////////////////////////////////////////////////////////////
// MoveList
///////////////////////////////////////////////////////////////////////

type MoveListsStateT = MoveListByIdT;
export type ReducerStateT = MoveListsStateT;

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
    case "INSERT_MOVES_INTO_LIST":
      const acc = insertIdsIntoList(
        action.moveIds,
        state[action.moveListId].moves,
        action.targetMoveId
      );
      return {
        ...state,
        [action.moveListId]: {
          ...state[action.moveListId],
          moves: acc,
        },
      };
    case "REMOVE_MOVES_FROM_LIST":
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

export const getMoveLists: Selector<Array<MoveListT>> = createSelector(
  [_stateMoveLists, _stateSelection],

  (stateMoveLists, stateSelection): Array<MoveListT> => {
    return getObjectValues(stateMoveLists);
  }
);
export const getMoveListById = _stateMoveLists;

export const reducer = moveListsReducer;
