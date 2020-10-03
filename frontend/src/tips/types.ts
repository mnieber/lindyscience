///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import { UUID } from 'src/kernel/types';

export type TipT = {
  id: UUID;
  ownerId: number;
  moveId: UUID;
  text: string;
  initialVoteCount: number;
  voteCount: number;
};

export type TipByIdT = {
  [id: string]: TipT;
};

export type TipsByIdT = {
  [id: string]: Array<TipT>;
};
