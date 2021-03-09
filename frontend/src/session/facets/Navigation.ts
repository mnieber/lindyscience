import { action, observable, runInAction } from 'mobx';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { operation } from 'facility';
import { host, stub } from 'aspiration';

export class Navigation_requestData {}

export class Navigation_navigateToMove {
  moveList: MoveListT = stub();
  move: MoveT = stub();
  navigate() {}
}

export class Navigation_navigateToMoveList {
  moveList: MoveListT = stub();
  navigate() {}
}

export class Navigation_storeLocation {}

export class Navigation_restoreLocation {}

export type DataRequestT = {
  moveSlugid?: string;
  moveListUrl?: string;
  profileUrl?: string;
};

export class Navigation {
  @observable history: any;
  @observable locationMemo?: string;
  @observable dataRequest: DataRequestT = {};

  @operation @host requestData(dataRequest: DataRequestT) {
    return action((cbs: Navigation_requestData) => {
      this.dataRequest = dataRequest;
    });
  }

  @operation @host navigateToMove(moveList: MoveListT, move: MoveT) {
    return action((cbs: Navigation_navigateToMove) => {
      cbs.navigate();
    });
  }

  @operation @host navigateToMoveList(moveList: MoveListT) {
    return action((cbs: Navigation_navigateToMoveList) => {
      cbs.navigate();
    });
  }

  @operation @host storeLocation() {
    return action((cbs: Navigation_storeLocation) => {
      this.locationMemo = window.location.pathname;
    });
  }

  @operation @host restoreLocation() {
    return action((cbs: Navigation_restoreLocation) => {
      this.history.push(this.locationMemo);
    });
  }

  static get = (ctr: any): Navigation => ctr.navigation;
}

interface PropsT {
  history: any;
}

export function initNavigation(self: Navigation, props: PropsT): Navigation {
  runInAction(() => {
    self.history = props.history;
  });
  return self;
}
