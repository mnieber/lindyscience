// @flow

import { combineReducers, compose } from "redux";
import { createSelector } from "reselect";
import {
  reduceMapToMap,
  getObjectValues,
  querySetListToDict,
} from "utils/utils";

import type { UUID } from "kernel/types";
import type { MoveT, MoveByIdT, MovePrivateDataByIdT } from "moves/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateMoves = (state: RootReducerStateT): MovesState => state.moves.moves;
const _stateMovePrivateDatas = (
  state: RootReducerStateT
): MovePrivateDatasState => state.moves.movePrivateDatas;

///////////////////////////////////////////////////////////////////////
// Private data
///////////////////////////////////////////////////////////////////////

type MovePrivateDatasState = MovePrivateDataByIdT;

export function movePrivateDatasReducer(
  state: MovePrivateDatasState = {},
  action: any
): MovePrivateDatasState {
  switch (action.type) {
    case "SET_SIGNED_IN_EMAIL":
      return {};
    case "ADD_MOVE_PRIVATE_DATAS":
      return { ...state, ...action.movePrivateDatas };
    case "SET_MOVE_PRIVATE_DATAS":
      return { ...action.movePrivateDatas };
    default:
      return state;
  }
}

export const getPrivateDataByMoveId: Selector<MovePrivateDataByIdT> = createSelector(
  [_stateMovePrivateDatas],

  (stateMovePrivateDatas): MovePrivateDataByIdT => {
    return getObjectValues(stateMovePrivateDatas).reduce((acc, x) => {
      acc[x.moveId] = x;
      return acc;
    }, {});
  }
);

///////////////////////////////////////////////////////////////////////
// Moves
///////////////////////////////////////////////////////////////////////

type MovesState = MoveByIdT;

export function movesReducer(state: MovesState = {}, action: any): MovesState {
  switch (action.type) {
    case "ADD_MOVES":
      return {
        ...state,
        ...querySetListToDict(action.moves),
      };
    default:
      return state;
  }
}

export const getMoveById: Selector<MoveByIdT> = createSelector(
  [_stateMoves, getPrivateDataByMoveId],

  (stateMoves, privateDataByMoveId): MoveByIdT => {
    return reduceMapToMap<MoveByIdT>(
      stateMoves,
      (acc, id: UUID, move: MoveT) => {
        acc[id] = {
          ...move,
          privateData: privateDataByMoveId[id] || {},
        };
      }
    );
  }
);
export const getMoves: Selector<Array<MoveT>> = createSelector(
  [getMoveById],

  (moveById): Array<MoveT> => {
    return getObjectValues(moveById);
  }
);

export type ReducerStateT = {
  moves: MovesState,
  movePrivateDatas: MovePrivateDatasState,
};

// $FlowFixMe
export const reducer = combineReducers({
  moves: movesReducer,
  movePrivateDatas: movePrivateDatasReducer,
});
