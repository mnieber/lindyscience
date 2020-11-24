import { observable, runInAction } from 'src/utils/mobx_wrapper';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { operation } from 'facility';
import { exec } from 'aspiration';

export type DataRequestT = {
  moveSlugid?: string;
  moveListUrl?: string;
  profileUrl?: string;
};

export class Navigation {
  @observable history: any;
  @observable locationMemo?: string;
  @observable dataRequest: DataRequestT = {};

  @operation requestData(dataRequest: DataRequestT) {
    this.dataRequest = dataRequest;
  }

  @operation navigateToMove(moveList: MoveListT, move: MoveT) {
    exec('navigate');
  }

  @operation navigateToMoveList(moveList: MoveListT) {
    exec('navigate');
  }

  @operation storeLocation() {
    this.locationMemo = window.location.pathname;
  }

  @operation restoreLocation() {
    this.history.push(this.locationMemo);
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
