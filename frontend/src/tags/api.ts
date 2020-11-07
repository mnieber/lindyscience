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

export function apiLoadKnownMoveTags() {
  const query = `query queryKnownMoveTags {
      moveTags
    }`;
  return doQuery(query, {}).then((response: any) => response.moveTags);
}

export function apiLoadKnownMoveListTags() {
  const query = `query queryKnownMoveListTags {
      moveListTags
    }`;
  return doQuery(query, {}).then((response: any) => response.moveListTags);
}
