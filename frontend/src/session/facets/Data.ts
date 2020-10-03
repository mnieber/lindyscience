import { observable } from 'src/utils/mobx_wrapper';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { TipsStore } from 'src/tips/TipsStore';
import { VotesStore } from 'src/votes/VotesStore';

export class Data {
  @observable moveListsStore: MoveListsStore = new MoveListsStore();
  @observable movesStore: MovesStore = new MovesStore();
  @observable tipsStore: TipsStore = new TipsStore();
  @observable votesStore: VotesStore = new VotesStore();

  static get = (ctr: any): Data => ctr.data;
}

export function initData(self: Data): Data {
  return self;
}
