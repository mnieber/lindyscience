// @flow

// Api profile

import { doQuery } from 'src/app/client';
import { flatten } from 'src/utils/utils';

export function apiLoadUserProfile() {
  const response = doQuery(
    `query queryUserProfile {
      userProfile {
        owner {
          username
        }
        user: owner {
          id
        }
        recentMoveUrl
        moveListIds
      }
    }`
  );

  return response.then((result) => {
    if (result.userProfile) {
      // put owner.username into the root as username
      flatten(result.userProfile, ['/owner'], (pk, ck) => ck);
      // put user.id into the root as userId
      flatten(result.userProfile, ['/user']);
    }
    return result.userProfile;
  });
}

export function apiUpdateProfile(moveUrl: string) {
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
    { moveUrl }
  );
}