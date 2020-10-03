// @flow

import { action, observable } from 'src/utils/mobx_wrapper';
import type { MoveListByIdT, MoveListT } from 'src/move_lists/types';
import type { TagMapT } from 'src/tags/types';
import type { UUID } from 'src/kernel/types';
import { addTags } from 'src/tags/utils';
import { getObjectValues, insertIdsIntoList } from 'src/utils/utils';

export class MoveListsStore {
  @observable moveListById: MoveListByIdT = {};
  @observable tags: TagMapT = {};

  @action addMoveLists(moveListById: MoveListByIdT) {
    this.moveListById = {
      ...this.moveListById,
      ...moveListById,
    };

    this.tags = {
      ...this.tags,
      ...addTags(
        getObjectValues(moveListById).map((x: MoveListT) => x.tags),
        this.tags
      ),
    };
  }

  @action insertMoveIds(
    moveListId: UUID,
    moveIds: Array<UUID>,
    targetMoveId: UUID,
    isBefore: boolean
  ) {
    const acc = insertIdsIntoList(
      moveIds,
      this.moveListById[moveListId].moves,
      targetMoveId,
      isBefore
    );
    return this.setMoveIds(moveListId, acc);
  }

  @action removeMoveIds(moveListId: UUID, moveIds: Array<UUID>) {
    const moves = this.moveListById[moveListId].moves.filter(
      (x) => !moveIds.includes(x)
    );
    return this.setMoveIds(moveListId, moves);
  }

  @action setMoveIds(moveListId: UUID, moveIds: Array<UUID>) {
    this.moveListById = {
      ...this.moveListById,
      [moveListId]: {
        ...this.moveListById[moveListId],
        moves: moveIds,
      },
    };
    return moveIds;
  }

  @action setTags(tags: TagMapT) {
    this.tags = tags;
  }
}
