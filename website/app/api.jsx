// @flow

import { flatten, toCamelCase, deepCopy } from 'utils/utils'
import { normalize, schema } from 'normalizr';
import { client, doQuery, setToken } from 'app/client';
import { post } from 'utils/api_utils';
import type { VoteT, TipT, VideoLinkT, MoveT } from 'moves/types'
import type { UUID } from 'app/types';


// Api app

// TODO: return a UserProfileT
export function loadUserProfile() {
  const response = doQuery(
    `query queryUserProfile {
      userProfile {
        owner {
          username
        }
        recentMoveList {
          id
        }
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
        flatten(
          result.userProfile,
          ['/recentMoveList']
        );
      }
      return result.userProfile;
    });
}

export async function signIn(email: string, password: string) {
  const rawResponse = await post('/auth/token/login', {email: email, password});
  const response = toCamelCase(rawResponse);
  if (response.authToken) {
    setToken(response.authToken);
    return await loadUserProfile();
  }
  return null;
}
