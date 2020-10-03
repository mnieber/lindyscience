// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import { UUID } from 'src/kernel/types';

export type UserProfileT = {
  moveListIds: Array<UUID>;
  userId: number;
  username: string;
  recentMoveUrl: string;
};
