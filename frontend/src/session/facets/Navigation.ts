import { observable, runInAction } from 'src/utils/mobx_wrapper';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { operation } from 'facet';
import { installHandlers } from 'facet-mobx';

export type DataRequestT = {
  moveSlugid?: string;
  moveListUrl?: string;
  profileUrl?: string;
};

export class Navigation {
  @observable history: any;
  @observable locationMemo?: string;
  // TODO: move data loading stuff out
  @observable dataRequest: DataRequestT = {};

  @operation requestData(dataRequest: DataRequestT) {
    this.dataRequest = dataRequest;
  }

  @operation navigateToMove(move: MoveT) {}
  @operation navigateToMoveList(moveList: MoveListT) {}

  @operation storeLocation() {
    this.locationMemo = window.location.pathname;
  }

  @operation restoreLocation() {
    this.history.push(this.locationMemo);
  }

  static get = (ctr: any): Navigation => ctr.navigation;
}

const _setHistory = (self: Navigation, history: any) => {
  runInAction(() => {
    self.history = history;
  });
};

interface PropsT {
  history: any;
  navigateToMoveList: (moveList: MoveListT) => void;
}

export function initNavigation(self: Navigation, props: PropsT): Navigation {
  _setHistory(self, props.history);
  installHandlers(
    {
      navigateToMoveList: props.navigateToMoveList,
    },
    self
  );
  return self;
}
