// Api votes

import { UUID } from 'src/kernel/types';
import { VoteT } from 'src/votes/types';
import { doQuery } from 'src/app/client';

export function apiLoadUserVotes() {
  return doQuery(
    `query queryUserVotes {
      userVotes {
        objectId
        value
      }
    }`
  ).then((result) =>
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

export const apiVoteTip = (objectId: UUID, value: VoteT) =>
  _castVote('moves', 'Tip', objectId, value);
