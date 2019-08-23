// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID } from "app/types";
import type { MovePrivateDataT } from "screens/types";
import type { TagT } from "profiles/types";

export type MoveT = {
  id: UUID,
  description: string,
  tags: Array<TagT>,
  videoLinks: Array<UUID>,
  tips: Array<UUID>,
  name: string,
  slug: string,
  ownerId: number,
  sourceMoveListId: string,
  privateData: ?MovePrivateDataT,
};

export type MoveByIdT = {
  [UUID]: MoveT,
};

export type MoveBySlugT = {
  [string]: MoveT,
};
