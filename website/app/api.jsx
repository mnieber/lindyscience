// @flow

import { flatten, toCamelCase } from "utils/utils";
import { doQuery, setToken } from "app/client";
import { get, post } from "utils/api_utils";
import type { UUID, VoteT } from "app/types";

// Api app

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

export async function signIn(email: string, password: string) {
  try {
    const rawResponse = await post("/auth/token/login", { email, password });
    const response = toCamelCase(rawResponse);
    if (response.authToken) {
      setToken(response.authToken);
      return true;
    }
  } catch (e) {
    console.error(e);
  }
  return false;
}

export async function signOut() {
  try {
    await post("/auth/token/logout", {});
    setToken("");
    return true;
  } catch (e) {
    console.error(e);
  }
  return false;
}

export async function getEmail() {
  try {
    const rawResponse = await get("/auth/users/me");
    const response = toCamelCase(rawResponse);
    return response.email;
  } catch (e) {
    return "";
  }
}

export async function resetPassword(email: string) {
  try {
    await post("/auth/password/reset/", {
      email: email,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function changePassword(
  newPassword: string,
  uid: string,
  token: string
) {
  try {
    await post("/auth/password/reset/confirm", {
      uid,
      token,
      new_password: newPassword,
    });
    return true;
  } catch (e) {
    return false;
  }
}
