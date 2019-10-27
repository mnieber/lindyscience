// @flow

import { type GetBvrT, behaviour_impl } from "facets/index";
import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { observable, runInAction } from "utils/mobx_wrapper";

// $FlowFixMe
@behaviour_impl
export class SessionData {
  @observable dispatch: Function;
  @observable movesCtr: MovesContainer;
  @observable moveListsCtr: MoveListsContainer;

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
