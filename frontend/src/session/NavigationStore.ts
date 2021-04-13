import { makeObservable, action, observable } from 'mobx';
import { MoveT } from 'src/moves/types';
import { MovesStore } from 'src/moves/MovesStore';
import { MoveListT } from 'src/movelists/types';
import { newMoveListSlug } from 'src/app/utils';
import { browseToMoveUrl } from 'src/app/components';
import { lookUp } from 'src/utils/utils';
import { getId, makeSlugidMatcher } from 'src/app/utils';
import { host, stub } from 'aspiration';

export class Navigation_requestData {
  dataRequest: DataRequestT = stub();
  loadData() {}
}

export type DataRequestT = {
  moveSlugid?: string;
  moveListUrl?: string;
  profileUrl?: string;
};

export class NavigationStore {
  @observable history: any;
  @observable locationMemo?: string;
  @observable dataRequest: DataRequestT = {};
  _movesStore: MovesStore;

  constructor(movesStore: MovesStore, history: any) {
    makeObservable(this);
    this._movesStore = movesStore;
    this.history = history;
  }

  @host requestData(dataRequest: DataRequestT) {
    return action((cbs: Navigation_requestData) => {
      this.dataRequest = dataRequest;
      cbs.loadData();
    });
  }

  navigateToMove(moveList: MoveListT, move: MoveT) {
    const moves = lookUp(moveList.moves, this._movesStore.moveById);
    const moveListUrl = moveList.ownerUsername + '/' + moveList.slug;
    const isSlugUnique = moves.filter(makeSlugidMatcher(move.slug)).length <= 1;
    const maybeMoveId = isSlugUnique ? '' : getId(move);

    browseToMoveUrl(
      this.history.push,
      [moveListUrl, move.slug, maybeMoveId],
      true
    );
  }

  navigateToMoveList(moveList: MoveListT) {
    const updateProfile = moveList.slug !== newMoveListSlug;
    const moveListUrl = moveList.ownerUsername + '/' + moveList.slug;

    browseToMoveUrl(this.history.push, [moveListUrl], updateProfile);
  }

  @action storeLocation() {
    this.locationMemo = window.location.pathname;
  }

  restoreLocation() {
    this.history.push(this.locationMemo);
  }
}
