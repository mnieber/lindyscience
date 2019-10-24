// @flow

import { type GetBvrT, facetClass, data } from "facet/index";
import { computed, observable } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";
import type { MoveListT } from "move_lists/types";
import { listToItemById } from "utils/utils";

// $FlowFixMe
@facetClass
export class Inputs {
  @observable moves: Array<MoveT> = [];
  @observable userProfile: ?UserProfileT;
  @observable moveList: ?MoveListT;
  @observable moveLists: Array<MoveListT> = [];

  static get: GetBvrT<Inputs>;
}

export function initInputs(self: Inputs): Inputs {
  return self;
}
