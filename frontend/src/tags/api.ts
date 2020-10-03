import { doQuery } from 'src/app/client';

export function apiLoadUserTags() {
  const query = `query queryUserTags {
      userTags {
        moveTags
        moveListTags
      }
    }`;
  return doQuery(query, {});
}
