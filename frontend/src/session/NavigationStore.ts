import { action, observable } from 'mobx';
import { MoveT } from 'src/moves/types';
import { MovesStore } from 'src/moves/MovesStore';
import { MoveListT } from 'src/move_lists/types';
import { operation } from 'facility';
import { newMoveListSlug } from 'src/app/utils';
import { browseToMoveUrl } from 'src/app/containers';
import { lookUp } from 'src/utils/utils';
import { getId, makeSlugidMatcher } from 'src/app/utils';
import { createBrowserHistory } from 'history';

export class Navigation_requestData {}

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

  constructor(movesStore: MovesStore) {
    this._movesStore = movesStore;
    this.history = createBrowserHistory({
      basename: process.env.PUBLIC_URL,
    });
  }

  @action @operation requestData(dataRequest: DataRequestT) {
    this.dataRequest = dataRequest;
  }

  @operation navigateToMove(moveList: MoveListT, move: MoveT) {
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

  @operation navigateToMoveList(moveList: MoveListT) {
    const updateProfile = moveList.slug !== newMoveListSlug;
    const moveListUrl = moveList.ownerUsername + '/' + moveList.slug;

    browseToMoveUrl(this.history.push, [moveListUrl], updateProfile);
  }

  @action @operation storeLocation() {
    this.locationMemo = window.location.pathname;
  }

  @operation restoreLocation() {
    this.history.push(this.locationMemo);
  }
}
