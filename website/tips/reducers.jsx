// @flow

import { createSelector } from "reselect";
import { isNone, reduceMapToMap } from "utils/utils";

import type { TipByIdT, TipsByIdT } from "tips/types";
import type { UUID } from "kernel/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

const _stateTips = (state: RootReducerStateT): TipsStateT => state.tips;

///////////////////////////////////////////////////////////////////////
// Tips
///////////////////////////////////////////////////////////////////////

type TipsStateT = TipByIdT;
export type ReducerStateT = TipsStateT;

export function tipsReducer(state: TipsStateT = {}, action: any): TipsStateT {
  switch (action.type) {
    case "ADD_TIPS":
      return {
        ...state,
        ...action.tips,
      };
    case "REMOVE_TIPS":
      return Object.keys(state)
        .filter(x => !action.tips.includes(x))
        .reduce((acc, id) => {
          acc[id] = state[id];
          return acc;
        }, {});
    case "CAST_VOTE":
      if (!state[action.id]) return state;
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          voteCount:
            state[action.id].voteCount + (action.vote - action.prevVote),
        },
      };
    default:
      return state;
  }
}

export function getTipById(state: RootReducerStateT) {
  return state.tips;
}
export const getTipsByMoveId: Selector<TipsByIdT> = createSelector(
  [_stateTips],

  (stateTips): TipsByIdT => {
    return reduceMapToMap<TipsByIdT>(stateTips, (acc, tipId, tip) => {
      if (isNone(acc[tip.moveId])) {
        acc[tip.moveId] = [];
      }
      acc[tip.moveId].push(tip);
      // TODO:
      // acc[tip.moveId] = acc[tip.moveId]
      //   .sort((lhs, rhs) => rhs.initialVoteCount - lhs.initialVoteCount);
    });
  }
);

export const reducer = tipsReducer;
