import { values } from 'lodash/fp';

import { MoveListByIdT } from 'src/move_lists/types';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { SessionContainer } from 'src/session/SessionCtr';
import { getCtr } from 'facility';

export function handleAddMoveListTags(
  this: MoveListsStore,
  moveListById: MoveListByIdT
) {
  const ctr = getCtr<SessionContainer>(this);
  ctr.tagsStore.addMoveListTags(values(moveListById).map((x) => x.tags));
}
