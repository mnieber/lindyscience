// @flow

import type { MoveByIdT } from "moves/types";
import { observable, runInAction } from "utils/mobx_wrapper";
import { type GetBvrT, facetClass } from "facets/index";
import type { UserProfileT } from "profiles/types";

// $FlowFixMe
@facetClass
export class Inputs {
  @observable userProfile: ?UserProfileT;
  @observable dispatch: Function;
  @observable moveById: MoveByIdT;
  static get: GetBvrT<Inputs>;
}

export function initInputs(self: Inputs, dispatch: Function): Inputs {
  runInAction("initInputs", () => {
    self.dispatch = dispatch;
  });
  return self;
}
