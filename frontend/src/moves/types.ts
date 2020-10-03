///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import { OwnedObjectT, UUID } from 'src/kernel/types';
import { TagT } from 'src/tags/types';

export type MoveT = OwnedObjectT & {
  description: string;
  tags: Array<TagT>;
  name: string;
  link: string;
  slug: string;
  startTimeMs?: number;
  endTimeMs?: number;
  sourceMoveListId: string;
};

export type MoveByIdT = {
  [id: string]: MoveT;
};

export type MoveBySlugT = {
  [id: string]: MoveT;
};

export type MovePrivateDataT = {
  id: UUID;
  moveId: UUID;
  notes: string;
  tags: Array<TagT>;
};

export type MovePrivateDataByIdT = { [id: string]: MovePrivateDataT };
