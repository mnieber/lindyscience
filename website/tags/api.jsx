// @flow

import { doQuery } from "app/client";

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
