// @flow

import React from "react";
import * as fromStore from "votes/reducers";
import type { VoteT, VoteByIdT } from "votes/types";
import type { UUID } from "kernel/types";

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
    console.log("STATE: ", getState());
    const prevVote = fromStore.getVoteByObjectId(getState())[id] || 0;

    dispatch({
      type: "CAST_VOTE",
      id: id,
      vote: vote,
      prevVote: prevVote,
    });
  };
}
