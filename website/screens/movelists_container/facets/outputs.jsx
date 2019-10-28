// @flow

import { type GetFacet, facetClass, output } from "facet/index";
import { computed, observable } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";
import type { UUID } from "kernel/types";
import { listToItemById } from "utils/utils";

// $FlowFixMe
@facetClass
export class Outputs {
  // $FlowFixMe
  @computed get moveListIds(): Array<UUID> {
    return Object.keys(this.moveListById);
  }
  // $FlowFixMe
  @computed get moveListById(): { [UUID]: MoveListT } {
    return listToItemById(this.preview);
  }
  @observable preview: Array<MoveListT> = [];
  @output display: Array<MoveListT> = [];

  static get: GetFacet<Outputs>;
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
