// @flow

import React from "react";
import * as fromStore from "app/reducers";
import { toTitleCase } from "utils/utils";
import type { UserProfileT, UUID, VoteT, VoteByIdT } from "app/types";

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actSetUserProfile(profile: UserProfileT) {
  return {
    type: "SET_USER_PROFILE",
    profile,
  };
}

export function actSetVotes(votes: VoteByIdT) {
  return {
    type: "SET_VOTES",
    votes: votes,
  };
}

export function actSetSignedInEmail(email: string) {
  return {
    type: "SET_SIGNED_IN_EMAIL",
    email,
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
