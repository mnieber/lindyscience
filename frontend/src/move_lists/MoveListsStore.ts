import { makeObservable, action, observable } from 'mobx';
import { MoveListByIdT, MoveListRSByIdT } from 'src/move_lists/types';
import { UUID } from 'src/kernel/types';
import { insertIdsIntoList } from 'src/utils/utils';
import { host, stub } from 'aspiration';
import { log, operation } from 'facility';

export class MoveListsStore_addMoveLists {
  moveListById: MoveListByIdT = stub();
}

export class MoveListsStore {
  @observable @log moveListById: MoveListByIdT = {};
  @observable moveListRSByUrl: MoveListRSByIdT = {};

  constructor() {
    makeObservable(this);
  }

  @operation @host addMoveLists(moveListById: MoveListByIdT) {
    return action((cbs: MoveListsStore_addMoveLists) => {
      this.moveListById = {
        ...this.moveListById,
        ...moveListById,
      };
    });
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
