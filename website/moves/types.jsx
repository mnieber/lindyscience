// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { OwnedObjectT } from "kernel/types";
import type { TagT } from "tags/types";
import type { UUID } from "kernel/types";

export type MoveT = OwnedObjectT & {
  description: string,
  tags: Array<TagT>,
  name: string,
  url: string,
  slug: string,
  sourceMoveListId: string,
  privateData: ?MovePrivateDataT,
};

export type MoveByIdT = {
  [UUID]: MoveT,
};

export type MoveBySlugT = {
  [string]: MoveT,
};

export type MovePrivateDataT = {
  id: UUID,
  notes: string,
  tags: Array<TagT>,
};

export type MovePrivateDataByIdT = { [UUID]: MovePrivateDataT };
