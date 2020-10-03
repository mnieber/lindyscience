// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { OwnedObjectT, UUID } from 'src/kernel/types';
import type { TagT } from 'src/tags/types';

export type MoveT = OwnedObjectT & {
  description: string,
  tags: Array<TagT>,
  name: string,
  link: string,
  slug: string,
  startTimeMs: ?number,
  endTimeMs: ?number,
  sourceMoveListId: string,
};

export type MoveByIdT = {
  [UUID]: MoveT,
};

export type MoveBySlugT = {
  [string]: MoveT,
};

export type MovePrivateDataT = {
  id: UUID,
  moveId: UUID,
  notes: string,
  tags: Array<TagT>,
};

export type MovePrivateDataByIdT = { [UUID]: MovePrivateDataT };