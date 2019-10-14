// @flow

import type { RootReducerStateT } from "app/root_reducer";

import type { VoteByIdT } from "votes/types";

///////////////////////////////////////////////////////////////////////
// Votes
///////////////////////////////////////////////////////////////////////

type VotesStateT = VoteByIdT;

export type ReducerStateT = VotesStateT;

export function votesReducer(
  state: VotesStateT = {},
  action: any
): VotesStateT {
  switch (action.type) {
    case "SET_VOTES":
      return {
        ...state,
        ...action.votes,
      };
    case "CAST_VOTE":
      return {
        ...state,
        [action.id]: action.vote,
      };
    default:
      return state;
  }
}

export const getVoteByObjectId = (state: RootReducerStateT): VoteByIdT =>
  state.votes;

export const reducer = votesReducer;
