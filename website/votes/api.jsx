// @flow

import { doQuery } from "app/client";
import { get, post } from "utils/api_utils";
import type { UUID, VoteT } from "votes/types";

// Api votes

export function loadUserVotes() {
  return doQuery(
    `query queryUserVotes {
      userVotes {
        objectId
        value
      }
    }`
  ).then(result =>
    result.userVotes.reduce((acc, vote) => {
      acc[vote.objectId] = vote.value;
      return acc;
    }, {})
  );
}

function _castVote(
  appLabel: string,
  model: string,
  objectId: UUID,
  value: VoteT
) {
  return doQuery(
    `mutation castVote(
      $appLabel: String!,
      $model: String!,
      $objectId: String!,
      $value: Int!
    ) {
      castVote(
        appLabel: $appLabel,
        model: $model,
        objectId: $objectId,
        value: $value
      ) {
        ok
        vote {
          value
        }
      }
    }`,
    { appLabel, model, objectId, value }
  );
}

export const voteTip = (objectId: UUID, value: VoteT) =>
  _castVote("moves", "Tip", objectId, value);
export const voteVideoLink = (objectId: UUID, value: VoteT) =>
  _castVote("moves", "VideoLink", objectId, value);
