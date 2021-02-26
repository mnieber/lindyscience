import { action, observable } from 'src/utils/mobx_wrapper';
import {
  MoveByIdT,
  MovePrivateDataByIdT,
  MovePrivateDataT,
  MoveT,
} from 'src/moves/types';
import { MoveSearchResultT } from 'src/search/types';
import { UUID } from 'src/kernel/types';
import { createUUID, listToItemById } from 'src/utils/utils';
import { operation } from 'facility';
import { host, stub } from 'aspiration';

export class MovesStore_addMoves {
  moves: Array<MoveT> = stub();
}

export class MovesStore {
  @observable privateDataByMoveId: MovePrivateDataByIdT = {};
  @observable moveById: MoveByIdT = {};
  @observable searchResults: Array<MoveSearchResultT> = [];

  @action addMovePrivateDatas(privateDataByMoveId: MovePrivateDataByIdT) {
    this.privateDataByMoveId = {
      ...this.privateDataByMoveId,
      ...privateDataByMoveId,
    };
  }

  @operation @host addMoves(moves: Array<MoveT>) {
    return (cbs: MovesStore_addMoves) => {
      this.moveById = {
        ...this.moveById,
        ...listToItemById(moves),
      };
    };
  }

  @action setPrivateDataByMoveId(privateDataByMoveId: MovePrivateDataByIdT) {
    this.privateDataByMoveId = privateDataByMoveId;
  }

  @action setSearchResults(searchResults: Array<MoveSearchResultT>) {
    this.searchResults = searchResults;
  }

  getOrCreatePrivateData(moveId: UUID): MovePrivateDataT {
    const mpd = this.privateDataByMoveId[moveId];
    return mpd
      ? mpd
      : {
          id: createUUID(),
          moveId,
          notes: '',
          tags: [],
        };
  }
}
