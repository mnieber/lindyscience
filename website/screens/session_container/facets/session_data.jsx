// @flow

import type { MoveByIdT, MoveT } from "moves/types";
import { lookUp } from "utils/utils";
import { computed, observable, runInAction } from "utils/mobx_wrapper";
import { type GetBvrT, behaviour_impl } from "facets/index";
import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";

// $FlowFixMe
@behaviour_impl
export class SessionData {
  @observable dispatch: Function;
  @observable movesCtr: MovesContainer;
  @observable moveListsCtr: MoveListsContainer;
  @observable moveById: MoveByIdT;

  // $FlowFixMe
  @computed get inputMoves(): Array<MoveT> {
    const moveList = this.moveListsCtr.highlight.item;
    return moveList
      ? lookUp(moveList ? moveList.moves : [], this.moveById).filter(x => !!x)
      : [];
  }
  static get: GetBvrT<SessionData>;
}

export function initSessionData(
  self: SessionData,
  dispatch: Function,
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer
): SessionData {
  runInAction("initSessionData", () => {
    self.dispatch = dispatch;
    self.movesCtr = movesCtr;
    self.moveListsCtr = moveListsCtr;
  });
  return self;
}
