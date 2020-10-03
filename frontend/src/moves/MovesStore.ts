// @flow

import { action, observable } from 'src/utils/mobx_wrapper';
import type {
  MoveByIdT,
  MovePrivateDataByIdT,
  MovePrivateDataT,
  MoveT,
} from 'src/moves/types';
import type { TagMapT } from 'src/tags/types';
import type { MoveSearchResultT } from 'src/search/types';
import type { UUID } from 'src/kernel/types';
import { createUUID, listToItemById } from 'src/utils/utils';
import { addTags } from 'src/tags/utils';

export class MovesStore {
  @observable privateDataByMoveId: MovePrivateDataByIdT = {};
  @observable moveById: MoveByIdT = {};
  @observable tags: TagMapT = {};
  @observable searchResults: Array<MoveSearchResultT> = [];

  @action addMovePrivateDatas(privateDataByMoveId: MovePrivateDataByIdT) {
    this.privateDataByMoveId = {
      ...this.privateDataByMoveId,
      ...privateDataByMoveId,
    };
  }

  @action addMoves(moves: Array<MoveT>) {
    this.moveById = {
      ...this.moveById,
      ...listToItemById(moves),
    };

    this.tags = {
      ...this.tags,
      ...addTags(
        moves.map((x: MoveT) => x.tags),
        this.tags
      ),
    };
  }

  @action setMovePrivateDatas(privateDataByMoveId: MovePrivateDataByIdT) {
    this.privateDataByMoveId = privateDataByMoveId;
  }

  @action setTags(tags: TagMapT) {
    this.tags = tags;
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
