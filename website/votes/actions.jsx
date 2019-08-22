// @flow

import React from "react";
import * as fromStore from "votes/reducers";
import type { UUID, VoteT, VoteByIdT } from "votes/types";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actSetVotes(votes: VoteByIdT) {
  return {
    type: "SET_VOTES",
    votes: votes,
  };
}

export function actCastVote(id: UUID, vote: VoteT) {
  return (dispatch: Function, getState: Function) => {
    const prevVote = fromStore.getVoteByObjectId(getState())[id] || 0;

    dispatch({
      type: "CAST_VOTE",
      id: id,
      vote: vote,
      prevVote: prevVote,
    });
  };
}
