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

export type VoteT = -1 | 0 | 1;

export type VoteByIdT = {
  [UUID]: VoteT,
};

export type SlugidT = string;

export type ObjectT = {
  id: UUID,
};

export type TagT = string;

export type TagMapT = {
  [TagT]: boolean,
};
