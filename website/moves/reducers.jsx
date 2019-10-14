// @flow

import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { reduceMapToMap, getObjectValues, listToItemById } from "utils/utils";
import { addTags } from "tags/utils";

import type { UUID } from "kernel/types";
import type { TagT, TagMapT } from "tags/types";
import type { MoveT, MoveByIdT, MovePrivateDataByIdT } from "moves/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateMoves = (state: RootReducerStateT): MovesStateT =>
  state.moves.moves;
const _stateTags = (state: RootReducerStateT): TagsStateT => state.moves.tags;
const _stateMovePrivateDatas = (
  state: RootReducerStateT
): MovePrivateDatasStateT => state.moves.movePrivateDatas;

///////////////////////////////////////////////////////////////////////
// Private data
///////////////////////////////////////////////////////////////////////

type MovePrivateDatasStateT = MovePrivateDataByIdT;

export function movePrivateDatasReducer(
  state: MovePrivateDatasStateT = {},
  action: any
): MovePrivateDatasStateT {
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

type MovesStateT = MoveByIdT;

export function movesReducer(
  state: MovesStateT = {},
  action: any
): MovesStateT {
  switch (action.type) {
    case "ADD_MOVES":
      return {
        ...state,
        ...listToItemById(action.moves),
      };
    default:
      return state;
  }
}

type TagsStateT = TagMapT;

export function tagsReducer(state: TagsStateT = {}, action: any): TagsStateT {
  switch (action.type) {
    case "SET_MOVE_TAGS":
      return {
        ...state,
        ...action.tags,
      };
    case "ADD_MOVES":
      return {
        ...state,
        ...addTags(getObjectValues(action.moves).map(x => x.tags), state),
      };
    default:
      return state;
  }
}

export const getMoveTags: Selector<Array<TagT>> = createSelector(
  [_stateTags],

  (stateTags): Array<TagT> => {
    return Object.keys(stateTags);
  }
);

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
  moves: MovesStateT,
  tags: TagsStateT,
  movePrivateDatas: MovePrivateDatasStateT,
};

// $FlowFixMe
export const reducer = combineReducers({
  tags: tagsReducer,
  moves: movesReducer,
  movePrivateDatas: movePrivateDatasReducer,
});
