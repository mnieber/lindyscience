// Api profile

import { doQuery } from 'src/app/client';
import { flatten } from 'src/utils/utils';

export function apiLoadUserProfile() {
  const query = `query queryUserProfile {
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
    }`;
  const response = doQuery(query, {});

  return response.then((result: any) => {
    if (result.userProfile) {
      // put owner.username into the root as username
      flatten(result.userProfile, ['/owner'], (pk: any, ck: any) => ck);
      // put user.id into the root as userId
      flatten(result.userProfile, ['/user']);
    }
    return result.userProfile;
  });
}

export function apiUpdateProfile(moveUrl: string) {
  const query = `mutation updateProfile(
      $moveUrl: String!,
    ) {
      updateProfile(
        recentMoveUrl: $moveUrl,
      ) {
        ok
      }
    }`;
  return doQuery(query, { moveUrl });
}
