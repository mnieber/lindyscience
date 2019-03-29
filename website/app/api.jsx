// @flow

import { flatten, toCamelCase } from "utils/utils";
import { doQuery, setToken } from "app/client";
import { get, post } from "utils/api_utils";
import type { UUID, VoteT } from "app/types";

function _hasError(e, fieldName, errorMsg) {
  const errors = e.responseJSON[fieldName] || [];
  return errors.includes(errorMsg);
}

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
    const response = toCamelCase(
      await post("/auth/token/login", { email, password })
    );
    if (response.authToken) {
      setToken(response.authToken);
      return "";
    }
  } catch (e) {
    return _hasError(
      e,
      "non_field_errors",
      "Unable to login with provided credentials."
    )
      ? "bad_credentials"
      : "cannot_sign_in";
  }
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
    const response = toCamelCase(await get("/auth/users/me"));
    return response.email;
  } catch (e) {
    return "";
  }
}

export async function resetPassword(email: string) {
  try {
    const response = toCamelCase(
      await post("/auth/password/reset/", {
        email: email,
      })
    );
    return "";
  } catch (e) {
    return _hasError(e, "email", "Enter a valid email address.")
      ? "invalid_email"
      : "cannot_reset";
  }
}

export async function changePassword(
  newPassword: string,
  uid: string,
  token: string
) {
  try {
    const response = toCamelCase(
      await post("/auth/password/reset/confirm", {
        uid,
        token,
        new_password: newPassword,
      })
    );
    return "";
  } catch (e) {
    return _hasError(e, "non_field_errors", "Invalid token for given user.")
      ? "invalid_token"
      : "cannot_sign_in";
  }
}

export async function activateAccount(uid: string, token: string) {
  try {
    const response = toCamelCase(
      await post("/auth/users/confirm/", {
        uid,
        token,
      })
    );
    return "";
  } catch (e) {
    return _hasError(e, "non_field_errors", "Invalid token for given user.")
      ? "invalid_token"
      : "cannot_sign_in";
  }
}
