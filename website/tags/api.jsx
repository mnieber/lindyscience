// @flow

import { doQuery } from "app/client";

export function apiLoadUserTags() {
  return doQuery(
    `query queryUserTags {
      userTags {
        moveTags
        moveListTags
      }
    }`
  );
}
