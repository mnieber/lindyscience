// @flow

import { type GetBvrT, facetClass, data } from "facets/index";
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
  // $FlowFixMe
  @computed get moveIds(): Array<UUID> {
    return Object.keys(this.moveById);
  }
  // $FlowFixMe
  @computed get moveById(): { [UUID]: MoveT } {
    return listToItemById(this.preview);
  }
  @observable userProfile: ?UserProfileT;
  @observable moveList: ?MoveListT;
  @observable moveLists: Array<MoveListT> = [];

  @observable preview: Array<MoveT> = [];
  @data display: Array<MoveT> = [];

  static get: GetBvrT<Inputs>;
}

export function initMovesData(self: Inputs): Inputs {
  return self;
}
