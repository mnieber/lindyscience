// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID } from "kernel/types";

export type TipT = {|
  id: UUID,
  ownerId: number,
  moveId: UUID,
  text: string,
  initialVoteCount: number,
  voteCount: number,
|};

export type TipByIdT = {
  [UUID]: TipT,
};

export type TipsByIdT = {
  [UUID]: Array<TipT>,
};
