// @flow

import type { UUID, OwnedObjectT } from 'src/kernel/types';
import type { TagT } from 'src/tags/types';

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
