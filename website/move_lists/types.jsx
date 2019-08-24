// @flow

import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";

export type MoveListT = {
  id: UUID,
  name: string,
  slug: string,
  description: string,
  isPrivate: boolean,
  role: string,
  tags: Array<TagT>,
  moves: Array<UUID>,
  ownerId: number,
  ownerUsername: string,
};

export type MoveListByIdT = {
  [UUID]: MoveListT,
};
