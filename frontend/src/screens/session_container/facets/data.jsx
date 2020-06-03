// @flow

import { observable, runInAction } from 'src/utils/mobx_wrapper';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { TipsStore } from 'src/tips/TipsStore';
import { VotesStore } from 'src/votes/VotesStore';

export class Data {
  @observable moveListsStore: MoveListsStore;
  @observable movesStore: MovesStore;
  @observable tipsStore: TipsStore;
  @observable votesStore: VotesStore;

  static get = (ctr: any): Data => ctr.data;
}

export function initData(self: Data): Data {
  runInAction('initData', () => {
    self.moveListsStore = new MoveListsStore();
    self.movesStore = new MovesStore();
    self.tipsStore = new TipsStore();
    self.votesStore = new VotesStore();
  });
  return self;
}
