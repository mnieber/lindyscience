import { values } from 'lodash/fp';

import { MoveListByIdT } from 'src/move_lists/types';
import { MovesStore } from 'src/moves/MovesStore';
import { SessionContainer } from 'src/session/SessionCtr';
import { getCtr } from 'facet';

export function handleAddMoveListTags(
  this: MovesStore,
  moveListById: MoveListByIdT
) {
  const ctr = getCtr<SessionContainer>(this);
  ctr.tagsStore.addMoveListTags(values(moveListById).map((x) => x.tags));
}
