import { values } from 'lodash/fp';

import { MoveListByIdT } from 'src/move_lists/types';
import { TagsStore } from 'src/tags/TagsStore';

export function handleAddMoveListTags(
  tagsStore: TagsStore,
  moveListById: MoveListByIdT
) {
  tagsStore.addMoveListTags(values(moveListById).map((x) => x.tags));
}
