import { observable } from 'src/utils/mobx_wrapper';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { TipsStore } from 'src/tips/TipsStore';
import { VotesStore } from 'src/votes/VotesStore';
import { data } from "facet";

export class Data {
  @data @observable moveListsStore: MoveListsStore = new MoveListsStore();
  @data @observable movesStore: MovesStore = new MovesStore();
  @data @observable tipsStore: TipsStore = new TipsStore();
  @data @observable votesStore: VotesStore = new VotesStore();

  static get = (ctr: any): Data => ctr.data;
}

export function initData(self: Data): Data {
  return self;
}
