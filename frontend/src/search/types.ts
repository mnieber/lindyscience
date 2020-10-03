// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import { UUID } from 'src/kernel/types';

export type MoveSearchResultT = {
  id: UUID;
  name: string;
  slug: string;
  sourceMoveList: any;
};

export type FunctionByIdT = {
  [UUID]: Function;
};

export type VotableT = {};
