// @flow

import { toCamelCase } from "utils/utils";
import { doQuery, setToken } from "app/client";
import { get, post } from "utils/api_utils";
import type { UUID } from "app/types";

function _hasError(e, fieldName, errorMsg) {
  const errors = e.responseJSON[fieldName] || [];
  return errors.includes(errorMsg);
}

// Api app

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
