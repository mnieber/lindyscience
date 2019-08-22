// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

export type UUID = string;

export type UserProfileT = {
  moveListIds: Array<UUID>,
  userId: number,
  username: string,
  recentMoveUrl: string,
};

export type SlugidT = string;

export type ObjectT = {
  id: UUID,
};

export type TagT = string;

export type TagMapT = {
  [TagT]: boolean,
};
