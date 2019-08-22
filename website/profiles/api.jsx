// @flow

import { flatten } from "utils/utils";
import { doQuery } from "app/client";

// Api profile

export function loadUserProfile() {
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

  return response.then(result => {
    if (result.userProfile) {
      // put owner.username into the root as username
      flatten(result.userProfile, ["/owner"], (pk, ck) => ck);
      // put user.id into the root as userId
      flatten(result.userProfile, ["/user"]);
    }
    return result.userProfile;
  });
}

export function updateProfile(moveUrl: string) {
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

export function loadUserTags() {
  return doQuery(
    `query queryUserTags {
      userTags {
        moveTags
        moveListTags
      }
    }`
  );
}
