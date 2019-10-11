// @flow

import type { UUID, OwnedObjectT } from "kernel/types";
import type { TagT } from "tags/types";

export type MoveListT = OwnedObjectT & {
  name: string,
  slug: string,
  description: string,
  isPrivate: boolean,
  role: string,
  tags: Array<TagT>,
  moves: Array<UUID>,
};

export type MoveListByIdT = {
  [UUID]: MoveListT,
};
