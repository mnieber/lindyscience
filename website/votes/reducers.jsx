// @flow

import { createSelector } from "reselect";

import type { VoteByIdT } from "app/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateVotes = (state: RootReducerStateT): VotesState => state.votes;

///////////////////////////////////////////////////////////////////////
// Votes
///////////////////////////////////////////////////////////////////////

type VotesState = VoteByIdT;

export function votesReducer(state: VotesState = {}, action: any): VotesState {
  switch (action.type) {
    case "SET_SIGNED_IN_EMAIL": // TODO: remove?
      return {};
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

export const getVoteByObjectId: Selector<VoteByIdT> = createSelector(
  [_stateVotes],

  (stateVotes): VoteByIdT => {
    return stateVotes;
  }
);

// $FlowFixMe
export const reducer = votesReducer;
