// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { OwnedObjectT } from "kernel/types";
import type { MovePrivateDataT } from "screens/types";
import type { TagT } from "profiles/types";
import type { UUID } from "kernel/types";

export type MoveT = OwnedObjectT & {
  description: string,
  tags: Array<TagT>,
  name: string,
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
