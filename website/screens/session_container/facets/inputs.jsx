// @flow

import type { MoveListT } from "move_lists/types";
import type { MoveByIdT } from "moves/types";
import { observable, runInAction } from "utils/mobx_wrapper";
import { type GetFacet, facetClass } from "facet";
import type { UserProfileT } from "profiles/types";

// $FlowFixMe
@facetClass
export class Inputs {
  @observable userProfile: ?UserProfileT;
  @observable dispatch: Function;
  @observable moveById: MoveByIdT;
  @observable moveLists: Array<MoveListT>;
  static get: GetFacet<Inputs>;
}

export function initInputs(self: Inputs, dispatch: Function): Inputs {
  runInAction("initInputs", () => {
    self.dispatch = dispatch;
  });
  return self;
}
