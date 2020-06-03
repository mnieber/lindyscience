// @flow

import { doQuery } from 'src/app/client';

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
