import { action, observable } from 'src/utils/mobx_wrapper';
import { MoveListByIdT, MoveListRSByIdT } from 'src/move_lists/types';
import { UUID } from 'src/kernel/types';
import { insertIdsIntoList } from 'src/utils/utils';
import { operation } from 'facet';

export class MoveListsStore {
  @observable moveListById: MoveListByIdT = {};
  @observable moveListRSByUrl: MoveListRSByIdT = {};

  @operation addMoveLists(moveListById: MoveListByIdT) {
    this.moveListById = {
      ...this.moveListById,
      ...moveListById,
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
}
