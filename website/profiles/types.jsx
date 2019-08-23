// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID } from "kernel/types";

export type UserProfileT = {
  moveListIds: Array<UUID>,
  userId: number,
  username: string,
  recentMoveUrl: string,
};

export type TagT = string;

export type TagMapT = {
  [TagT]: boolean,
};
