// @flow

import { flatten, toCamelCase, deepCopy } from 'utils/utils'
import { normalize, schema } from 'normalizr';
import { client, doQuery, setToken } from 'app/client';
import { get, post } from 'utils/api_utils';
import type { TipT, VideoLinkT, MoveT } from 'moves/types'
import type { UUID, VoteT } from 'app/types';


// Api app

export function loadUserProfile() {
  const response = doQuery(
    `query queryUserProfile {
      userProfile {
        owner {
          username
        }
        recentMoveUrl
        moveListIds
      }
    }`
  );

  const composeKeys = (pk, ck) => ck;
  return response
    .then(result => {
      if (result.userProfile) {
        flatten(
          result.userProfile,
          ['/owner'],
          composeKeys
        );
      }
      return result.userProfile;
    });
}


export function updateProfile(
  moveUrl: string,
) {
  return doQuery(
    `mutation updateProfile(
      $moveUrl: String!,
    ) {
      updateProfile(
        recentMoveUrl: $moveUrl,
      ) {
        ok
      }
    }`,
    {moveUrl}
  )
}


export function loadUserVotes() {
  return doQuery(
    `query queryUserVotes {
      userVotes {
        objectId
        value
      }
    }`
  )
  .then(result => result.userVotes.reduce(
    (acc, vote) => {
      acc[vote.objectId] = vote.value;
      return acc;
    },
    {}
  ))
}


function _castVote(
  appLabel: string,
  model: string,
  objectId: UUID,
  value: VoteT,
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
    {appLabel, model, objectId, value}
  )
}


export const voteTip = (objectId: UUID, value: VoteT) => _castVote('moves', 'Tip', objectId, value);
export const voteVideoLink = (objectId: UUID, value: VoteT) => _castVote('moves', 'VideoLink', objectId, value);


export async function signIn(email: string, password: string) {
  try {
    const rawResponse = await post('/auth/token/login', {email, password});
    const response = toCamelCase(rawResponse);
    if (response.authToken) {
      setToken(response.authToken);
      return true;
    }
  }
  catch(e) {
    console.error(e);
  }
  return false;
}


export async function getEmail() {
  try {
    const rawResponse = await get('/auth/users/me');
    const response = toCamelCase(rawResponse);
    return response.email;
  }
  catch(e) {
    return "";
  }
}
